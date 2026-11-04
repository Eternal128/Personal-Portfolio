import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const outDir = path.join(assetsDir, 'hero');

// Screenshots shown in the hero's laptop. Add a project here when it moves into
// the first three of the projects list, then add it to src/assets/hero/index.js.
const SOURCES = [
  { name: 'vortex', file: 'projects/vortex.jpg' },
  { name: 'carver', file: 'projects/carver.jpg' },
  { name: 'coven', file: 'projects/coven.jpg' },
];

const WIDTHS = [1440, 960];

await mkdir(outDir, { recursive: true });

for (const { name, file } of SOURCES) {
  const input = path.join(assetsDir, file);
  for (const width of WIDTHS) {
    const output = path.join(outDir, `${name}-${width}.webp`);
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(output);
    console.log(`${file} -> hero/${name}-${width}.webp`);
  }
}
