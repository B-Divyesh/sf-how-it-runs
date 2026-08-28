import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve } from 'node:path';

const expectedRange = '^20.19.0 || >=22.12.0';
const root = resolve('.');
const npmCli = process.env.npm_execpath;

if (!npmCli) throw new Error('npm_execpath is required to test the documented Node.js runtimes.');

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const readme = readFileSync(join(root, 'README.md'), 'utf8');
if (packageJson.engines?.node !== expectedRange) throw new Error(`package.json must declare ${expectedRange}.`);
if (!readme.includes('Use Node.js 20.19+ (20.x) or 22.12+.')) throw new Error('README does not state the tested Node.js range.');

const tempRoot = mkdtempSync(join(tmpdir(), 'how-it-runs-node-'));
const ignored = new Set(['.git', 'dist', 'node_modules', 'test-results']);

function run(version, args, cwd) {
  const result = spawnSync('npx', ['--yes', '--package', `node@${version}`, 'node', npmCli, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: '1' },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(`Node.js ${version}: npm ${args.join(' ')} failed.`);
  }
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
}

try {
  for (const version of ['20.19.0', '22.12.0', '24']) {
    const sandbox = join(tempRoot, `node-${version.replaceAll('.', '-')}`);
    cpSync(root, sandbox, {
      recursive: true,
      filter(source) {
        if (source === root) return true;
        const first = relative(root, source).split('/')[0];
        return !ignored.has(first) && basename(source) !== '.DS_Store';
      },
    });
    run(version, ['ci', '--no-audit', '--no-fund'], sandbox);
    run(version, ['test'], sandbox);
    run(version, ['run', 'build'], sandbox);
    if (!readFileSync(join(sandbox, 'dist', 'index.html'), 'utf8').includes('<main id="main"')) {
      throw new Error(`Node.js ${version}: build did not produce the expected site root.`);
    }
  }
  console.log('@claim:node-runtime-support PASS (Node.js 20.19.0, 22.12.0, and latest 24 LTS)');
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
