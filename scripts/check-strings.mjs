// Proves components carry no hard-coded copy. Run: npm run check:strings
// 1) any Arabic letter in src/components or src/app (copy belongs in messages/*.json)
// 2) JSX text nodes that look like English prose: >Word word< between tags
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src/components', 'src/app'];
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  statSync(p).isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(f) && files.push(p);
});
roots.forEach(walk);

const arabic = /[؀-ۿ]/;
const englishJsxText = />\s*[A-Z][a-z]+(?:\s+[a-zA-Z,.'’-]+){1,}\s*</;
let problems = 0;
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$|\/\*.*?\*\/|^\s*\*.*$/g, '');
    if (arabic.test(code) || englishJsxText.test(code)) {
      problems++;
      console.log(`${f}:${i + 1}: ${line.trim()}`);
    }
  });
}
console.log(problems ? `${problems} hard-coded string(s) found` : `No hard-coded strings in ${files.length} files`);
process.exit(problems ? 1 : 0);
