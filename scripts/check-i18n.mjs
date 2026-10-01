// Verifies ar/en message parity and SEO length budgets. Run: npm run check:i18n
import { readFileSync } from 'node:fs';

const load = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), 'utf8'));
const flat = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));

const ar = Object.fromEntries(flat(load('ar')));
const en = Object.fromEntries(flat(load('en')));
let failed = false;

for (const k of Object.keys(ar)) if (!(k in en)) (failed = true), console.error(`missing in en: ${k}`);
for (const k of Object.keys(en)) if (!(k in ar)) (failed = true), console.error(`missing in ar: ${k}`);

const suffix = { ar: ' | المركز الأفريقي للاستشارات الهندسية', en: ' | ACEC' };
const sample = { reg: '406' };
for (const [locale, m] of [['ar', ar], ['en', en]]) {
  for (const [k, v] of Object.entries(m)) {
    const fill = String(v).replace(/\{(\w+)\}/g, (_, n) => sample[n] ?? n);
    if (/^meta\.\w+\.title$/.test(k)) {
      const full = fill + (k === 'meta.home.title' ? ' | ACEC' : suffix[locale]);
      if (full.length > 60) console.warn(`[${locale}] title ${full.length} chars: ${full}`);
    }
    if (/^meta\.\w+\.description$/.test(k) && fill.length > 155)
      (failed = true), console.error(`[${locale}] description ${fill.length} > 155: ${k}`);
  }
}
console.log(failed ? 'i18n check FAILED' : `i18n OK — ${Object.keys(ar).length} keys per locale`);
process.exit(failed ? 1 : 0);
