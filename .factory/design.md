# Visual thesis — The civic systems atlas

## Direction and fit

`How It Runs` is an **art-deco transit poster brought to life**. Public systems are
usually hidden behind walls and specialist language; transit posters made large,
shared infrastructure feel legible and civic. Strong geometry, cropped machine
silhouettes, route-line diagrams, and optimistic poster color turn each simulation
into a place a child can enter rather than a dashboard they must decode.

The interface is deliberately single-mode: a deep midnight-blue "control room"
surrounds warm paper panels. This stable high-contrast world keeps the colorful
flows readable and makes watch mode feel like a small theatre.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Night | `#102B3A` | page, headings, ink |
| Deep night | `#081C25` | control room, footer |
| Paper | `#FFF6DF` | primary surface |
| Paper shade | `#F2E3C0` | recessed areas |
| Water | `#2A7896` | links, water flow |
| Marigold | `#F2B544` | focus, energy, primary action |
| Coral | `#CF493E` | faults and warnings |
| Leaf | `#287A5B` | success and safe quality |
| Muted ink | `#52636B` | supporting copy on paper |

All body text combinations meet 4.5:1. Status is always paired with a word or
symbol, never communicated by color alone.

## Type and spacing

- Display: **Arial Narrow / Franklin Gothic Condensed / sans-serif**, uppercase,
  tracked, used like poster lettering. No webfont is required or downloaded.
- Reading/UI: **Avenir Next / Trebuchet MS / sans-serif**, chosen for open forms and
  child-friendly clarity. Numbers use tabular figures.
- Scale: 14 / 16 / 18 / 24 / 36 / 56 px with responsive clamps for the two largest.
- Spacing follows an 8 px base rhythm; 4 px is reserved for inline optical tweaks.
  Content measure is capped near 70 characters. Controls are at least 44 px high.

## Layout and interaction grammar

The home screen is a poster wall: a single strong introduction, an illustrated
civic panorama, then three route tickets. Inside a system, a dark stage holds a
left-to-right flow diagram and a warm dispatch desk holds the levers. Every stage
uses the same grammar: choose a system, adjust three levers, read three outcomes,
then try the unlocked disruption. The primary action is marigold with a dark
offset shadow; selection is a punched-ticket notch and inset keyline.

On phones the panorama becomes a narrow banner, system tickets stack, and the
flow diagram scrolls horizontally rather than shrinking labels. Outcomes move
ahead of detailed explanations so the cause-and-effect loop remains visible.

## Motion

UI feedback lasts 150–240 ms. Flow dots move along pipes/belts using transform,
gauges ease between values, and a single route line draws when a system starts.
Watch mode changes one lever at a time every 3.6 seconds and narrates why. It has
an explicit pause control. Under `prefers-reduced-motion`, flow dots become static,
state changes are immediate, and watch mode continues through captions without
animated transitions.

## Asset plan and provenance

- Hero: original raster illustration of three interlocking civic systems, generated
  specifically for this product, used as atmosphere rather than a technical diagram.
- System diagrams and icons: original semantic HTML/CSS and hand-authored SVG-like
  geometry; labels carry the factual meaning.
- No brands, real plants, people, or copied characters.

### Prompt sheet

Use case: `illustration-story`. Asset: wide landing-page hero. Subject: a stylised
municipal water works, small power grid, and neighborhood bakery connected as one
friendly civic panorama. World: optimistic 1930s art-deco transit poster, simplified
geometric machinery, pipes, pylons, ovens, reservoirs and small houses. Materials:
screen-printed paper, subtle ink grain, crisp flat shapes. Light: sunrise cream behind
deep navy silhouettes. Lens/composition: wide side elevation, generous sky/negative
space, strong diagonals leading left to right. Palette: midnight blue, cream paper,
marigold, muted teal, coral accents. Negative list: no text, no letters, no numbers,
no watermark, no logo, no branded objects, no real people, no photorealism, no
fantasy machinery, no technical labels.

Generation: Azure AI Foundry factory image deployment via
`/opt/fleet/lib/gen-image.sh`, 2026-08-27. Generated imagery is original for this
product and disclosed in the footer. The retained source prompt is stored beside
the source image in `assets/src/hero-poster.json`.
