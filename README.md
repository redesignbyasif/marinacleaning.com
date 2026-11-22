# Marina Cleaning Services, Inc. — Homepage Concept

A custom, premium single-page homepage designed for **Marina Cleaning Services, Inc.**, a locally owned
residential cleaning company in Wells, Maine, serving Wells, Kennebunk, Ogunquit, York and the surrounding
coast.

The existing site (`https://marinacleaning.com/`) was researched for business facts, brand assets and brand
colours. This is a design concept prepared for the owner — it is **not** the live site, and it deliberately
carries a `noindex, nofollow` directive so it never competes with the real domain in search results.

---

## What's inside

```
/
├── index.html                  # the whole homepage (semantic HTML5)
├── css/
│   └── style.css               # design system + all styles (mobile-first)
├── js/
│   └── script.js               # navigation, tabs, accordion, scroll effects
├── assets/
│   ├── fonts/                  # self-hosted Fraunces + Inter (variable, Latin subset)
│   ├── logo/                   # original logo, background cleaned (header + footer lockups)
│   ├── icons/                  # SVG favicon, touch icon
│   └── images/                 # WebP + JPEG photography (hero, rooms, coast)
├── .nojekyll                   # lets GitHub Pages serve the assets folder untouched
└── README.md
```

No frameworks, no build step and no dependencies — plain HTML, CSS and vanilla JavaScript.
Every path is relative, so the site works both at a domain root and inside a project subdirectory
(`https://user.github.io/repo/`).

## Brand

| Token | Value | Use |
| --- | --- | --- |
| Deep purple | `#4C216E` | primary actions, accents, links |
| Plum ink | `#2A1138` | dark sections, footer headlines |
| Lavender | `#C2A0CB` | secondary accent, rules, icons |
| Lavender tint | `#F0E7F2` | soft panels |
| Paper cream | `#FAF6EF` | page background |
| Warm sand | `#F3ECE1` | alternating sections |
| Ink | `#231528` | headings |

The purple and lavender are taken from the original logo; cream and sand were added as neutrals to give the
brand an editorial, coastal feel without leaving its palette.

**Type:** *Fraunces* (display serif) paired with *Inter* (UI/body). Both are self-hosted as WOFF2
variable fonts in `assets/fonts/` — subset to Latin and narrowed to the weights actually used
(~230 KB total), so the page has no third-party font requests and no layout flash from a remote CDN.

## Content accuracy

All business details — name, phone `(207) 337-3315`, PO Box 855, Wells ME 04090, hours, services, FAQ
answers, founder and manager quotes — come from the existing website. Nothing is invented:

- No testimonials are shown, because none are published on the current site.
- The contact block intentionally has **no fake form**. Booking is via phone/text/Facebook, which is how the
  business actually works. A demo form would suggest a backend that does not exist.
- Photography is licensed-style studio imagery generated for this concept; it is not presented as real
  customer photography. Staff portraits are represented by typographic monograms for the same reason.

## Local preview

Any static server works:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying to GitHub Pages

1. Merge this branch into `main`.
2. In the repository: **Settings → Pages**.
3. Source: **Deploy from a branch** → Branch `main`, folder `/ (root)` → **Save**.
4. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

`index.html` sits at the repository root, and `.nojekyll` is present, so no further configuration is needed.

## What was tested

Rendering was checked in headless Chromium at **320, 360, 390, 768, 1024 and 1440 px**:

- No horizontal overflow at any width (`scrollWidth === clientWidth`); no console errors.
- Mobile menu opens/closes, locks scroll, traps Tab, closes on Esc and on link tap.
- Room tabs switch panels and respond to arrow keys; only one FAQ answer opens at a time.
- The mobile call/quote bar appears after the hero and is `inert` when hidden.
- All local asset paths resolve; no broken images; images carry `alt` text and intrinsic dimensions.
- HTML validated with `html-validate` and CSS with `stylelint` (only "use a non-breaking hyphen in
  phone numbers" hints remain — handled in CSS with `white-space: nowrap`).

Browser support: current Chrome, Safari, Firefox and Edge. `backdrop-filter`, `aspect-ratio`,
`inert` and `text-wrap: balance` degrade gracefully where unsupported.

## Accessibility & performance notes

- Semantic landmarks, a skip link, visible focus states and keyboard-operable tabs/accordion.
- `prefers-reduced-motion` disables the marquee and all transitions.
- Images are served as WebP with JPEG fallbacks, sized and lazy-loaded (hero is preloaded).
- Total page weight is roughly 0.75 MB including photography and fonts (WebP where supported).
- Before or after deploying, set `og:image` to an absolute URL (social scrapers do not resolve
  relative paths) — e.g. `https://<user>.github.io/<repo>/assets/images/hero-cleaner.jpg`.
