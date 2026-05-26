// Generate clean 81x81 PNG tab bar icons with bold line-art style
// Usage: node scripts/generate-icons.cjs
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const SIZE = 81;
const OUT_DIR = path.join(__dirname, '..', 'miniprogram', 'images', 'tab');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// --- Drawing helpers (no AA — clean pixel art for small icons) ---

function createBuf() {
  return Buffer.alloc(SIZE * SIZE * 4, 0);
}

function rect(buf, x, y, w, h, r, g, b) {
  for (let dy = Math.max(0, y); dy < Math.min(SIZE, y + h); dy++) {
    for (let dx = Math.max(0, x); dx < Math.min(SIZE, x + w); dx++) {
      const i = (dy * SIZE + dx) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    }
  }
}

function circleFilled(buf, cx, cy, r, color) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (d <= r) {
        const i = (y * SIZE + x) * 4;
        buf[i] = color[0]; buf[i + 1] = color[1]; buf[i + 2] = color[2]; buf[i + 3] = 255;
      }
    }
  }
}

function circleStroke(buf, cx, cy, outerR, innerR, color) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (d <= outerR && d >= innerR) {
        const i = (y * SIZE + x) * 4;
        buf[i] = color[0]; buf[i + 1] = color[1]; buf[i + 2] = color[2]; buf[i + 3] = 255;
      }
    }
  }
}

function hline(buf, y, x1, x2, thick, color) {
  rect(buf, x1, y - Math.floor(thick / 2), x2 - x1, thick, color[0], color[1], color[2]);
}

function vline(buf, x, y1, y2, thick, color) {
  rect(buf, x - Math.floor(thick / 2), y1, thick, y2 - y1, color[0], color[1], color[2]);
}

// --- PNG encoding ---

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crcIn = Buffer.concat([typeB, data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(crcIn), 0);
  return Buffer.concat([len, typeB, data, c]);
}

function encodePNG(buf) {
  const raw = Buffer.alloc(SIZE * (1 + SIZE * 4));
  for (let y = 0; y < SIZE; y++) {
    raw[y * (1 + SIZE * 4)] = 0;
    buf.copy(raw, y * (1 + SIZE * 4) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', compressed), pngChunk('IEND', Buffer.alloc(0))]);
}

// --- Icon drawing ---

function drawIcon(type, r, g, b) {
  const buf = createBuf();
  const C = [r, g, b];
  const W = 8;  // stroke width

  if (type === 'dashboard') {
    // 2×2 grid of bold squares, filling most of the canvas
    const s = 24, gap = 9, ox = 12, oy = 12;
    rect(buf, ox, oy, s, s, r, g, b);
    rect(buf, ox + s + gap, oy, s, s, r, g, b);
    rect(buf, ox, oy + s + gap, s, s, r, g, b);
    rect(buf, ox + s + gap, oy + s + gap, s, s, r, g, b);
  } else if (type === 'workout') {
    // Bold dumbbell centered
    const barY = 40;
    hline(buf, barY, 10, SIZE - 10, 8, C);
    // Left plates (larger)
    rect(buf, 1, barY - 20, 12, 40, r, g, b);
    rect(buf, 0, barY - 14, 16, 28, r, g, b);
    // Right plates
    rect(buf, SIZE - 13, barY - 20, 12, 40, r, g, b);
    rect(buf, SIZE - 16, barY - 14, 16, 28, r, g, b);
  } else if (type === 'diet') {
    // Apple silhouette — clean and recognizable for diet/food
    // Apple body (filled circle, slightly flattened)
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const cx = SIZE / 2, cy = 42;
        const dx = (x - cx) / 1.05; // slightly wider
        const dy = y - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        // Apple shape: wider at top, narrower at bottom
        const r = 22 + (dy < 0 ? 2 : dy > 10 ? -4 : 0);
        if (d <= r) {
          const i = (y * SIZE + x) * 4;
          buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
        }
        // Bite mark (cutout on right side)
        if (d <= r && x > cx - 2 && y > cy - 14 && y < cy + 14) {
          const bx = x - (cx + 8), by = y - (cy + 4);
          if (Math.sqrt(bx * bx + by * by) < 12) {
            const i = (y * SIZE + x) * 4;
            buf[i + 3] = 0; // transparent bite
          }
        }
      }
    }
    // Stem
    rect(buf, SIZE / 2 - 3, 8, 6, 16, r, g, b);
    // Leaf
    rect(buf, SIZE / 2 + 3, 10, 14, 5, r, g, b);
  } else if (type === 'profile') {
    // Person silhouette: circle head + semicircle body
    circleFilled(buf, SIZE / 2, 20, 12, C);
    // Body: filled semicircle at bottom
    const bcy = 55;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        // Wide U-shape: outer circle minus inner circle
        const d = Math.sqrt((x - SIZE / 2) ** 2 + (y - bcy) ** 2);
        if (d <= 28 && d >= 14 && y >= 20) {
          const i = (y * SIZE + x) * 4;
          buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
        }
        // Fill shoulders (connect head to body)
        if (y >= 30 && y <= 35 && x >= SIZE / 2 - 16 && x <= SIZE / 2 + 16) {
          // Check if inside the outer body circle
          const sd = Math.sqrt((x - SIZE / 2) ** 2 + (y - bcy) ** 2);
          if (sd <= 28) {
            const i = (y * SIZE + x) * 4;
            buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
          }
        }
      }
    }
  }

  return encodePNG(buf);
}

// --- Generate ---

const icons = ['dashboard', 'workout', 'diet', 'profile'];
const gray = [0x99, 0x99, 0x99];
const green = [0x07, 0xC1, 0x60];

for (const name of icons) {
  fs.writeFileSync(path.join(OUT_DIR, `${name}.png`), drawIcon(name, ...gray));
  fs.writeFileSync(path.join(OUT_DIR, `${name}-active.png`), drawIcon(name, ...green));
  console.log(`Generated ${name}.png + ${name}-active.png`);
}
console.log('Done!');
