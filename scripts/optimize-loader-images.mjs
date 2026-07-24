import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const outDir = path.join(assetsDir, 'loader');

const SOURCES = [
  { name: 'about', file: 'projects/about.jpg' },
  { name: 'roomie', file: 'projects/roomie.png' },
  { name: 'quietspace', file: 'projects/quietspace.png' },
  { name: 'virus', file: 'projects/covid.jpeg' },
  { name: 'road', file: 'projects/road.jpeg' },
  { name: 'editor', file: 'projects/editor.png' },
  { name: 'chess', file: 'projects/chess.jpeg' },
  { name: 'music', file: 'projects/music.jpeg' },
  { name: 'meal', file: 'projects/meal.jpeg' },
  { name: 'machine', file: 'projects/machine.png' },
  { name: 'covid', file: 'covid-19.png' },
];

await mkdir(outDir, { recursive: true });

for (const { name, file } of SOURCES) {
  const input = path.join(assetsDir, file);
  const output = path.join(outDir, `${name}.webp`);
  await sharp(input).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toFile(output);
  console.log(`${file} -> loader/${name}.webp`);
}
