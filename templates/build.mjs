import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pages = JSON.parse(await readFile(path.join(root, "site/pages.json"), "utf8"));

const nav = `
    <header class="site-header">
      <a class="brand" href="/" aria-label="aYoo Tools home">
        <img src="/assets/ayoo-mark.svg" alt="" width="36" height="36">
        <span>aYoo Tools</span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <a href="/tools/">Tools</a>
        <a href="/guides/">Guides</a>
        <a href="/about/">About</a>
      </nav>
    </header>`;

const adBlock = `
    <div class="ad-slot" aria-label="Advertisement">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2589137463971131"
           crossorigin="anonymous"></script>
      <!-- 2026ForAyoo -->
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-2589137463971131"
           data-ad-slot="1398901631"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>`;

const footer = `
    <footer class="site-footer">
      <p>&copy; <span data-year></span> aYoo Tools.</p>
      <nav aria-label="Footer">
        <a href="/privacy/">Privacy</a>
        <a href="/contact/">Contact</a>
      </nav>
    </footer>`;

function documentFor(page, main) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <link rel="canonical" href="https://ayoo.com${page.path}">
    <link rel="stylesheet" href="/styles.css">
    <script defer src="/script.js"></script>
  </head>
  <body>
${nav}

${main}
${adBlock}
${footer}
  </body>
</html>
`;
}

function outputPath(urlPath) {
  if (urlPath === "/") return path.join(root, "index.html");
  return path.join(root, urlPath.replace(/^\//, ""), "index.html");
}

for (const page of pages) {
  const main = (await readFile(path.join(root, "site/content", page.content), "utf8")).trim();
  const out = outputPath(page.path);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, documentFor(page, main));
  console.log(`built ${page.path}`);
}
