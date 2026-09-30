/**
 * Removes a block of text painted on a flat surface (a van panel) by
 * rebuilding each row from the pixels either side of it, so the panel's own
 * shading and highlights survive. Used to take unverified claims such as
 * "24/7 MOBILE SERVICE" off stock photography.
 */
const sharp = require('sharp')

/**
 * `side` picks where the replacement colour comes from: 'both' blends the
 * pixels left and right of the box (best on an open panel), 'left' uses only
 * the left side — needed when something else (an arm, a wheel) sits directly
 * to the right of the text.
 */
async function eraseText(src, out, boxes, pad = 70, feather = 6, side = 'both') {
  const img = sharp(src)
  const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels
  const at = (x, y) => (y * info.width + x) * ch
  const sample = (x0, x1, y) => {
    const acc = new Array(ch).fill(0)
    let n = 0
    for (let x = Math.max(0, x0); x < Math.min(info.width, x1); x++) {
      const i = at(x, y)
      for (let c = 0; c < ch; c++) acc[c] += data[i + c]
      n++
    }
    return acc.map((v) => v / Math.max(1, n))
  }
  for (const box of boxes) {
    for (let y = box.top; y < box.top + box.height; y++) {
      const left = sample(box.left - pad, box.left - 4, y)
      const right = side === 'left' ? left : sample(box.left + box.width + 4, box.left + box.width + pad, y)
      const vy = Math.min(1, Math.min(y - box.top, box.top + box.height - 1 - y) / feather)
      for (let x = box.left; x < box.left + box.width; x++) {
        const t = (x - box.left) / (box.width - 1)
        const a = Math.min(Math.min(1, Math.min(x - box.left, box.left + box.width - 1 - x) / feather), vy)
        const i = at(x, y)
        for (let c = 0; c < ch; c++) data[i + c] = Math.round(data[i + c] * (1 - a) + (left[c] * (1 - t) + right[c] * t) * a)
      }
    }
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toFile(out)
}

module.exports = { eraseText }
