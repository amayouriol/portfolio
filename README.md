# Andrea Mayo — Product Explorer

Personal portfolio of Andrea Mayo: finance background, MBA at Berkeley Haas, heading into Product Management.

**Live site:** https://amayouriol.github.io/portfolio/

The site is a small space-ship journey. A Star Wars-style crawl introduces Andrea, then a navigation deck (with a droid, MVP-8) "travels" by hyperspace to each section:

| Section | What it shows |
|---|---|
| **My Story** | The path from finance to product, as an orbital diagram and four chapters |
| **How I Work** | Four anonymized case studies with metrics and a Problem → Impact flow |
| **Experience** | Role timeline with highlights, education, and an animated top-skills panel |
| **Portfolio** | Personal projects: a recruiting CRM, a Spotify lyrics game, and Buddi |
| **Contact** | Email, LinkedIn, GitHub and Substack |

## Tech

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies.
Fonts (Space Grotesk, DM Mono, Manrope) load from Google Fonts.

```
index.html          page shell and metadata
styles.css          keyframe animations and interactive states
main.js             content, rendering, navigation and animations
assets/andrea.jpg   hero portrait (processed to match the cyan hologram look)
favicon.svg         site icon (plus favicon-32.png and apple-touch-icon.png)
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing content

Everything lives at the top of `main.js`:

- **`CONFIG`**: email, LinkedIn, GitHub, Substack and the photo path. A link left empty is hidden.
- **`DEST`**: the five navigation destinations and the droid's lines.
- **`PROJECTS`**: the How I Work case studies.
- **`JOBS`, `CAPS`, `EDU`**: the Experience timeline, top skills and education.
- **`SLOTS`**: Portfolio projects. Add `href` (and optionally `cta`) to show a link button.

Colours follow a small palette: space black `#020405`, graphite `#080A0B`, light surface `#F1F0EA`, crawl yellow `#E8C943`, amber `#E39B36`, tech blue `#65B9D0`.

## Deploying

The site is served by GitHub Pages from the `main` branch, root folder. Push to `main` and the live site updates in about a minute.

## Accessibility and motion

- A skip link, labelled sections, keyboard focus styles and `aria-expanded` on all toggles.
- Respects `prefers-reduced-motion`: the crawl and animations are skipped and the skill bars show full.

## Content and privacy

Case studies and experience are anonymized: no client, deal or internal system names. Metrics shown are the ones Andrea has confirmed.

## Credits

Designed in Claude Design, built with Claude Code.
