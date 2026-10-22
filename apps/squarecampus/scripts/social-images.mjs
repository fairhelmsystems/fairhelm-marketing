// One-time artwork preparation; uses Sharp already installed by Next.js.
// bun scripts/social-images.mjs /absolute/path/to/source.png
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = process.argv[2];
if (!source) throw new Error("Pass the supplied 2:1 SquareCampus artwork path.");
const metadata = await sharp(source).metadata();
if (!metadata.width || metadata.width !== metadata.height * 2) {
  throw new Error("Expected 2:1 artwork; refusing to stretch or crop a different aspect ratio.");
}

const directory = fileURLToPath(new URL("../public/social/", import.meta.url));
await mkdir(directory, { recursive: true });
const artwork = await sharp(source)
  .resize({ width: 1200 })
  .flatten({ background: "#021c41" })
  .toColourspace("srgb")
  .removeAlpha()
  .png()
  .toBuffer();

for (const [platform, padding] of [
  ["x", 0],
  ["og", 15],
]) {
  const image = sharp(artwork);
  if (padding) {
    // The source's top-left navy is RGB(2,28,65). The complete 1200x600
    // artwork is centred, with exactly 15 additional pixels above and below.
    image.extend({ top: padding, bottom: padding, left: 0, right: 0, background: "#021c41" });
  }
  const output = `${directory}squarecampus-${platform}-v1.jpg`;
  const result = await image.jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toFile(output);
  if (result.size >= 1_000_000) throw new Error(`${output} exceeds the 1 MB target.`);
  console.log(`${output}: ${result.width}x${result.height}, ${result.size} bytes`);
}
