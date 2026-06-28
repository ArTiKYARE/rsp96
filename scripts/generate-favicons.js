const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SVG_PATH = path.resolve(__dirname, "../public/images/logo.svg");
const OUT_DIR = path.resolve(__dirname, "../app");

const SIZES = {
  favicon: [16, 32, 48],
  apple: 180,
  icon192: 192,
};

async function renderPng(size, padding = 0.1) {
  const svg = fs.readFileSync(SVG_PATH);
  const density = Math.max(72, Math.round((size / 107) * 300));
  const base = await sharp(svg, { density })
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  if (padding <= 0) return base;

  const pad = Math.round(size * padding);
  const newSize = size + pad * 2;
  return sharp({
    create: {
      width: newSize,
      height: newSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([{ input: base, gravity: "center" }])
    .png()
    .toBuffer();
}

function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const entries = [];
  const images = [];

  for (const png of pngBuffers) {
    const size = png.length;
    const meta = pngBuffers.indexOf(png);
    // We rely on the fact that each PNG was rendered at the intended square size.
    const dimension = Math.round(Math.sqrt(size)); // not used, we track separately

    const entry = Buffer.alloc(16);
    // We need actual dimensions; read from sharp would be cleaner but we know them.
    entries.push(entry);
    images.push(png);
  }

  // Re-calculate with known sizes
  const sizes = pngBuffers.map((b, i) => SIZES.favicon[i]);
  for (let i = 0; i < count; i++) {
    const png = pngBuffers[i];
    const dim = sizes[i] >= 256 ? 0 : sizes[i];
    const entry = entries[i];
    entry.writeUInt8(dim, 0);
    entry.writeUInt8(dim, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...images]);
}

async function main() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error("SVG logo not found at", SVG_PATH);
    process.exit(1);
  }

  const faviconPngs = await Promise.all(SIZES.favicon.map((s) => renderPng(s, 0)));
  const icoBuffer = buildIco(faviconPngs);
  fs.writeFileSync(path.join(OUT_DIR, "favicon.ico"), icoBuffer);
  console.log("Generated app/favicon.ico", icoBuffer.length, "bytes");

  const apple = await renderPng(SIZES.apple, 0.1);
  fs.writeFileSync(path.join(OUT_DIR, "apple-icon.png"), apple);
  console.log("Generated app/apple-icon.png", apple.length, "bytes");

  const icon192 = await renderPng(SIZES.icon192, 0.1);
  fs.writeFileSync(path.join(OUT_DIR, "icon.png"), icon192);
  console.log("Generated app/icon.png", icon192.length, "bytes");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
