# beyond entropy — newflamer

Statically-exported Next.js rebuild of the xvrx site.

## Quick start

```bash
npm install
npm run build     # collects blog assets + statically exports to ./out
npm start         # serves ./out at http://localhost:3000
```

Dev mode with hot reload:

```bash
npm run dev
```

## The home scene

A free rigged character (`public/models/soldier.glb`, from the three.js
examples / Mixamo) stands in a Three.js stage wearing a cape simulated
with Verlet cloth physics under a gusting wind field. Drag to inspect —
the camera orbits on x/y and is clamped to the positive-z hemisphere.
The mouse wheel is reserved: scrolling down plays an exit sequence and
hands off to `/blog`.

## Writing a post

Each post is a folder under `content/blog/`:

```
content/blog/my-post/
├── index.md      # frontmatter: title, date, category, description, (updated)
└── diagram.png   # any static file, referenced as ./diagram.png
```

Everything except `.md` files is copied to `public/blog/<slug>/` before
every dev/build run (`scripts/collect-assets.mjs`), so relative
references like `![x](./diagram.png)` just work.

The blog index groups posts by the `category` frontmatter field (set it
manually per post — e.g. `category: "proposal"`); categories are ordered
by their most recent filing, posts newest-first within each.
