#!/usr/bin/env node
/**
 * Rasterizes the favicon (src/app/icon.svg, the roundel on a rounded square)
 * into the two PNG sizes the web manifest and iOS need:
 *
 *   src/app/apple-icon.png    180² — iOS home screen
 *   public/brand/icon-512.png 512² — manifest / Android
 *
 * Run: npm run icons   (after editing icon.svg)
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const svg = await readFile(path.join(root, "src", "app", "icon.svg"));

const targets = [
  { size: 180, out: path.join(root, "src", "app", "apple-icon.png") },
  { size: 512, out: path.join(root, "public", "brand", "icon-512.png") },
];

for (const { size, out } of targets) {
  // Render at a high density so the curves come out clean, then downsample.
  await sharp(svg, { density: 72 * (size / 100) * 2 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`wrote ${path.relative(root, out)} (${size}²)`);
}
