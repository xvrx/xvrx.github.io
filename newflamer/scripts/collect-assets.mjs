// Collects every non-markdown file from content/blog/<slug>/ into
// public/blog/<slug>/ so each post folder can carry its own images and
// static files. Runs automatically before `next dev` and `next build`.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content", "blog");
const publicDir = path.join(root, "public", "blog");

fs.rmSync(publicDir, { recursive: true, force: true });

if (!fs.existsSync(contentDir)) {
  console.log("[collect-assets] no content/blog directory, nothing to do");
  process.exit(0);
}

let copied = 0;
for (const entry of fs.readdirSync(contentDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slugDir = path.join(contentDir, entry.name);
  for (const file of fs.readdirSync(slugDir, { withFileTypes: true, recursive: true })) {
    if (!file.isFile() || file.name.endsWith(".md")) continue;
    const src = path.join(file.parentPath ?? file.path, file.name);
    const rel = path.relative(slugDir, src);
    const dest = path.join(publicDir, entry.name, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    copied++;
  }
}
console.log(`[collect-assets] ${copied} asset(s) collected into public/blog/`);
