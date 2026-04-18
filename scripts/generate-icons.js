const fs = require("fs");
const zlib = require("zlib");

// CRC32 implementation
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writePng(path, width, height, color) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = color[0];
    pixels[i + 1] = color[1];
    pixels[i + 2] = color[2];
    pixels[i + 3] = color[3];
  }

  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    const rowStart = y * width * 4;
    for (let x = 0; x < width * 4; x++) {
      row[1 + x] = pixels[rowStart + x];
    }
    rows.push(row);
  }

  const idat = zlib.deflateSync(Buffer.concat(rows));
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    makeChunk("IHDR", Buffer.concat([
      makeUint32(width),
      makeUint32(height),
      Buffer.from([0x08, 0x06, 0x00, 0x00, 0x00])
    ])),
    makeChunk("IDAT", idat),
    makeChunk("IEND", Buffer.alloc(0))
  ]);

  fs.writeFileSync(path, png);
}

function makeUint32(value) {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(value, 0);
  return buf;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lengthBuf = makeUint32(data.length);
  const crcBuf = makeUint32(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
}

const icons = [
  { size: 16, color: [29, 78, 216, 255] },
  { size: 32, color: [16, 185, 129, 255] },
  { size: 48, color: [234, 179, 8, 255] },
  { size: 128, color: [248, 113, 113, 255] }
];

if (!fs.existsSync("assets")) {
  fs.mkdirSync("assets");
}

icons.forEach((icon) => {
  writePng(`assets/icon${icon.size}.png`, icon.size, icon.size, icon.color);
  console.log(`Written assets/icon${icon.size}.png`);
});
