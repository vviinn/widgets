const fs = require("fs");
const path = require("path");

const SHARP_VERSION = "0.35.4";

// sharp carries ~27 MB of native binaries for a conversion that runs once every
// few years, so it is installed on demand rather than declared as a dependency.
let sharp;
try {
  sharp = require("sharp");
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
  console.error(
    `sharp is not installed — run \`npm i --no-save sharp@${SHARP_VERSION}\` and rerun this script.`,
  );
  process.exit(1);
}

const sourcePath = path.resolve(__dirname, "../src/favicon.svg");
const icoPath = path.resolve(__dirname, "../src/favicon.ico");
const appleTouchIconPath = path.resolve(
  __dirname,
  "../src/apple-touch-icon.png",
);

// Storybook serves its own static dir, so the icons are mirrored there instead
// of being kept in step by hand.
const mirrorDir = path.resolve(__dirname, "../storybook/public");

// Legacy browsers and Windows shell contexts pick a layer by size, so the .ico
// carries all three rather than a single scaled bitmap.
const ICO_SIZES = [16, 32, 48];
const APPLE_TOUCH_ICON_SIZE = 180;

const ICO_HEADER_BYTES = 6;
const ICO_ENTRY_BYTES = 16;

const renderPng = (size) =>
  sharp(sourcePath, { density: 384 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * Packs PNG buffers into an ICO container. PNG-compressed layers are understood
 * by every browser we support and keep the file a fraction of the BMP size.
 */
function packIco(images) {
  const header = Buffer.alloc(ICO_HEADER_BYTES);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = ICO_HEADER_BYTES + images.length * ICO_ENTRY_BYTES;

  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(ICO_ENTRY_BYTES);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // 0 encodes 256
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size — unused for true colour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

async function generateFavicons() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source favicon not found: ${sourcePath}`);
    process.exit(1);
  }

  const images = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, data: await renderPng(size) })),
  );
  fs.writeFileSync(icoPath, packIco(images));
  console.log(
    `Wrote ${path.relative(process.cwd(), icoPath)} (${ICO_SIZES.join(", ")}px)`,
  );

  // iOS composites a transparent touch icon onto black, so flatten it first.
  await sharp(sourcePath, { density: 384 })
    .resize(APPLE_TOUCH_ICON_SIZE, APPLE_TOUCH_ICON_SIZE)
    .flatten({ background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile(appleTouchIconPath);
  console.log(
    `Wrote ${path.relative(process.cwd(), appleTouchIconPath)} (${APPLE_TOUCH_ICON_SIZE}px)`,
  );

  [sourcePath, icoPath, appleTouchIconPath].forEach((filePath) => {
    const target = path.join(mirrorDir, path.basename(filePath));
    fs.copyFileSync(filePath, target);
    console.log(`Mirrored ${path.relative(process.cwd(), target)}`);
  });
}

generateFavicons().catch((error) => {
  console.error(error);
  process.exit(1);
});
