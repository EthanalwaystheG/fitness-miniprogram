// Generate clean line-style 81x81 PNG tab bar icons
// Usage: node scripts/generate-icons.cjs
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const SIZE = 81;
const OUT_DIR = path.join(__dirname, '..', 'miniprogram', 'images', 'tab');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function createBuffer() {
  return Buffer.alloc(SIZE * SIZE * 4, 0); // RGBA, transparent bg
}

function setPixel(buf, x, y, r, g, b, a) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
  const idx = (y * SIZE + x) * 4;
  // Alpha blending over transparent
  const srcA = a / 255;
  const dstA = buf[idx + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA > 0) {
    buf[idx] = Math.round((r * srcA + buf[idx] * dstA * (1 - srcA)) / outA);
    buf[idx + 1] = Math.round((g * srcA + buf[idx + 1] * dstA * (1 - srcA)) / outA);
    buf[idx + 2] = Math.round((b * srcA + buf[idx + 2] * dstA * (1 - srcA)) / outA);
    buf[idx + 3] = Math.round(outA * 255);
  }
}

// Anti-aliased circle outline
function drawCircle(buf, cx, cy, r, strokeW, color) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const halfW = strokeW / 2;
      const inner = Math.max(0, dist - (r - halfW));
      const outer = Math.max(0, (r + halfW) - dist);
      const alpha = Math.min(1, inner / 0.5, outer / 0.5);
      if (alpha > 0) {
        setPixel(buf, x, y, color[0], color[1], color[2], Math.round(alpha * 255));
      }
    }
  }
}

// Anti-aliased line (thick)
function drawLine(buf, x1, y1, x2, y2, strokeW, color) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      // Distance from point to line segment
      const px = x - x1;
      const py = y - y1;
      const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (len * len)));
      const closestX = x1 + t * dx;
      const closestY = y1 + t * dy;
      const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
      const halfW = strokeW / 2;
      if (dist < halfW + 0.5) {
        const alpha = Math.min(1, (halfW + 0.5 - dist) / 0.5);
        setPixel(buf, x, y, color[0], color[1], color[2], Math.round(alpha * 255));
      }
    }
  }
}

// Filled rounded rectangle (for grid squares)
function drawRoundedRect(buf, rx, ry, rw, rh, radius, color) {
  for (let y = Math.max(0, ry); y < Math.min(SIZE, ry + rh); y++) {
    for (let x = Math.max(0, rx); x < Math.min(SIZE, rx + rw); x++) {
      let alpha = 1;
      // Check rounded corners
      if (x < rx + radius && y < ry + radius) {
        const dx = x - (rx + radius);
        const dy = y - (ry + radius);
        const dist = Math.sqrt(dx * dx + dy * dy);
        alpha = Math.max(0, Math.min(1, radius - dist + 0.5));
      } else if (x >= rx + rw - radius && y < ry + radius) {
        const dx = x - (rx + rw - radius - 1);
        const dy = y - (ry + radius);
        const dist = Math.sqrt(dx * dx + dy * dy);
        alpha = Math.max(0, Math.min(1, radius - dist + 0.5));
      } else if (x < rx + radius && y >= ry + rh - radius) {
        const dx = x - (rx + radius);
        const dy = y - (ry + rh - radius - 1);
        const dist = Math.sqrt(dx * dx + dy * dy);
        alpha = Math.max(0, Math.min(1, radius - dist + 0.5));
      } else if (x >= rx + rw - radius && y >= ry + rh - radius) {
        const dx = x - (rx + rw - radius - 1);
        const dy = y - (ry + rh - radius - 1);
        const dist = Math.sqrt(dx * dx + dy * dy);
        alpha = Math.max(0, Math.min(1, radius - dist + 0.5));
      }
      if (alpha > 0) {
        const a = Math.round(alpha * color[3]);
        setPixel(buf, x, y, color[0], color[1], color[2], a);
      }
    }
  }
}

// --- PNG encoding ---

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeB, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeB, data, crcVal]);
}

function encodePNG(buf, width, height) {
  // Build raw scanlines (filter byte 0 + RGBA pixels)
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      rawData[dstIdx] = buf[srcIdx];
      rawData[dstIdx + 1] = buf[srcIdx + 1];
      rawData[dstIdx + 2] = buf[srcIdx + 2];
      rawData[dstIdx + 3] = buf[srcIdx + 3];
    }
  }

  const compressed = zlib.deflateSync(rawData);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdrData),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Icon drawing functions ---

function drawIcon(name, color) {
  const buf = createBuffer();
  const c = [...color, 255]; // add alpha

  if (name === 'dashboard') {
    // 2x2 grid of small filled squares
    const cellGap = 8;
    const cellSize = 22;
    const startX = (SIZE - cellSize * 2 - cellGap) / 2;
    const startY = (SIZE - cellSize * 2 - cellGap) / 2;
    drawRoundedRect(buf, startX, startY, cellSize, cellSize, 4, c);
    drawRoundedRect(buf, startX + cellSize + cellGap, startY, cellSize, cellSize, 4, c);
    drawRoundedRect(buf, startX, startY + cellSize + cellGap, cellSize, cellSize, 4, c);
    drawRoundedRect(buf, startX + cellSize + cellGap, startY + cellSize + cellGap, cellSize, cellSize, 4, c);
  } else if (name === 'workout') {
    // Dumbbell: horizontal bar + two small rectangles on ends
    const barY = SIZE / 2;
    const barStart = 12;
    const barEnd = SIZE - 12;
    drawLine(buf, barStart, barY, barEnd, barY, 5, c);
    // Left weight plate (small filled rect)
    drawRoundedRect(buf, 4, barY - 14, 16, 28, 5, c);
    drawRoundedRect(buf, 0, barY - 10, 18, 20, 5, c);
    // Right weight plate
    drawRoundedRect(buf, SIZE - 20, barY - 14, 16, 28, 5, c);
    drawRoundedRect(buf, SIZE - 18, barY - 10, 18, 20, 5, c);
  } else if (name === 'diet') {
    // Bowl/plate: curved arc with chopsticks or fork
    // Bowl body (semi-circle arc at bottom)
    const cx = SIZE / 2;
    const cy = SIZE * 0.55;
    const bowlR = 22;
    drawCircle(buf, cx, cy, bowlR, 5, c);
    // Erase top part of circle to make it a bowl (draw a line across)
    // Actually, draw chopsticks above
    // Left chopstick
    drawLine(buf, cx - 6, cy - bowlR - 10, cx - 6, cy - bowlR + 2, 3.5, c);
    // Right chopstick
    drawLine(buf, cx + 6, cy - bowlR - 6, cx + 6, cy - bowlR + 6, 3.5, c);
    // Small steam lines
    drawLine(buf, cx - 8, cy - bowlR - 14, cx - 4, cy - bowlR - 14, 2, c);
    drawLine(buf, cx + 2, cy - bowlR - 10, cx + 8, cy - bowlR - 10, 2, c);
  } else if (name === 'profile') {
    // Person silhouette: circle head + curved body line
    const headCx = SIZE / 2;
    const headCy = SIZE * 0.28;
    const headR = 10;
    drawCircle(buf, headCx, headCy, headR, 5, c);
    // Body: U-shaped curve from neck down
    const neckY = headCy + headR + 2;
    const bodyW = 18;
    const bodyH = 30;
    // Left side of body
    drawLine(buf, headCx - bodyW / 2, neckY, headCx - bodyW / 2 + 2, neckY + bodyH, 5, c);
    // Right side of body
    drawLine(buf, headCx + bodyW / 2, neckY, headCx + bodyW / 2 - 2, neckY + bodyH, 5, c);
    // Bottom curve
    drawCircle(buf, headCx, neckY + bodyH, bodyW / 2 + 2, 5, c);
    // Shoulder curve left
    drawLine(buf, headCx - 4, neckY, headCx - bodyW / 2, neckY + 4, 5, c);
    // Shoulder curve right
    drawLine(buf, headCx + 4, neckY, headCx + bodyW / 2, neckY + 4, 5, c);
  }

  return encodePNG(buf, SIZE, SIZE);
}

// --- Generate all icons ---

const icons = [
  { name: 'dashboard', label: '概览' },
  { name: 'workout', label: '训练' },
  { name: 'diet', label: '饮食' },
  { name: 'profile', label: '我的' },
];

const normalColor = [0x99, 0x99, 0x99];  // #999999
const activeColor = [0x07, 0xC1, 0x60];  // #07C160

for (const icon of icons) {
  // Normal (unselected)
  const normalPNG = drawIcon(icon.name, normalColor);
  fs.writeFileSync(path.join(OUT_DIR, `${icon.name}.png`), normalPNG);

  // Active (selected)
  const activePNG = drawIcon(icon.name, activeColor);
  fs.writeFileSync(path.join(OUT_DIR, `${icon.name}-active.png`), activePNG);

  console.log(`Generated ${icon.name}.png and ${icon.name}-active.png`);
}

console.log('Done! 8 icons generated in', OUT_DIR);
