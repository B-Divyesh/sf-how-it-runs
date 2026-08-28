import { createReadStream, existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => args.includes(flag) ? args[args.indexOf(flag) + 1] || fallback : fallback;
const host = valueAfter('--host', '127.0.0.1');
const port = Number(valueAfter('--port', '4173'));
const root = resolve('dist');
const config = JSON.parse(await readFile(join(root, 'staticwebapp.config.json'), 'utf8'));

const types = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.webp': 'image/webp',
};

function matches(route, pathname) {
  if (route === '/*') return true;
  if (route.endsWith('*')) return pathname.startsWith(route.slice(0, -1));
  return pathname === route;
}

function headersFor(pathname) {
  const route = config.routes?.find((entry) => matches(entry.route, pathname));
  return { ...config.globalHeaders, ...route?.headers };
}

function fileFor(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  const target = normalize(join(root, relative));
  if (!target.startsWith(`${root}/`) && target !== root) return null;
  if (existsSync(target)) return target;
  const directoryIndex = normalize(join(root, decoded, 'index.html'));
  if (directoryIndex.startsWith(`${root}/`) && existsSync(directoryIndex)) return directoryIndex;
  return target;
}

async function sendFile(response, filename, pathname, headOnly) {
  const details = await stat(filename);
  response.writeHead(200, {
    ...headersFor(pathname),
    'Content-Length': details.size,
    'Content-Type': types[extname(filename)] || 'application/octet-stream',
  });
  if (headOnly) return response.end();
  createReadStream(filename).pipe(response);
}

const server = createServer(async (request, response) => {
  if (!request.url || !['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end();
  }
  let pathname;
  try {
    pathname = new URL(request.url, `http://${request.headers.host || host}`).pathname;
    const requested = fileFor(pathname);
    if (requested && existsSync(requested)) return sendFile(response, requested, pathname, request.method === 'HEAD');
  } catch {
    response.writeHead(400);
    return response.end('Bad request');
  }

  const notFound = join(root, '404.html');
  if (existsSync(notFound)) {
    const details = await stat(notFound);
    response.writeHead(404, { ...headersFor(pathname), 'Content-Length': details.size, 'Content-Type': 'text/html; charset=utf-8' });
    if (request.method === 'HEAD') return response.end();
    return createReadStream(notFound).pipe(response);
  }
  response.writeHead(404, headersFor(pathname));
  return response.end('Not found');
});

server.listen(port, host, () => {
  console.log(`Production static preview: http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
