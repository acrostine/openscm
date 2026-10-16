# customisations/

**Everything in this folder was added by the publisher module. None of it comes from Archi.**

A published Archi HTML report normally contains only:

    index.html  css/  elements/  hints/  js/  lib/  model-<MODEL>/

Anything else at the top level, and everything under this folder, is ours. The point of the split
is that a published site can be diffed against a stock Archi export and the difference is legible
rather than archaeological.

## What lives here

| Folder | Contents |
|---|---|
| `img/` | Site logo and any other branding images |
| `data/` | CSV exports of the model (elements, properties, relations) |
| `analytics/` | The SQL console (two variants — see below) and vendored sql.js |
| `nav/` | *(reserved)* lightbox navigation pages — see the known exception below |

## The SQL console — two variants, both shipped

The Query tab in `model.html` runs a real SQL console over this model's data.

| File | Needs a web server? | Size | Notes |
|---|---|---|---|
| `analytics/query.html` | **No** | ~1 MB | Data and the sql.js WebAssembly binary are embedded in the page. **This is what the Query tab uses.** |
| `analytics/query-server.html` | Yes | ~8 KB | Loads `data/*.csv` and the `.wasm` as separate files. |

**Why two.** Browsers block `fetch()` and WebAssembly loading from `file://` URLs. A site opened by
double-clicking `index.html` — from a folder, a USB stick, OneDrive — cannot load either the CSVs or
the `.wasm` as separate files, so the console would sit there doing nothing. The self-contained
variant has no such dependency: opening it costs exactly one request (itself).

When the site *is* served over HTTP, `query-server.html` is the better page — the browser caches the
wasm separately and the CSVs stay inspectable. Point the Query tab at it by editing the iframe `src`
in `model-<MODEL>/elements/model.html`.

The CSVs in `data/` are useful on their own — open them in Excel, or load them into any SQL tool.

## Replacing the logo

Overwrite `img/site-logo.png`. Any image works — it is displayed 28px tall inside the 45px navbar,
and width scales to preserve the aspect ratio.

## Known exceptions — things we add that are NOT in here

The demarcation cannot be perfect. These are the deliberate exceptions, all of them structural:

1. **`index.html`** — Archi's own file. The publisher patches the navbar into it (logo + top-line
   menu). Cannot move; it is the site's entry point.
2. **`index_lightbox.html`** — an entry point in its own right, opened directly and targeted by the
   Lightbox menu item. Kept at the root so the second front door is findable.
3. **`model-<MODEL>/elements/model.html`** — Archi generates it and the publisher's iframe defaults
   to it. The publisher edits it in place (tab strip). Cannot move.
4. **`model-<MODEL>/views/nav-*.html`** — the four lightbox navigation pages. Still in Archi's
   `views/` folder because they use `../views/` and `../images/` relative links from there. Moving
   them requires rewriting that path logic in `lightbox_nav.py`. **Deferred deliberately** (Bora,
   10 Sep 2026) rather than bundled into an unrelated change.

Every file the module adds is listed in `MANIFEST.json` in this folder, with the step that wrote it
and when — so the exceptions above are checkable rather than remembered.
