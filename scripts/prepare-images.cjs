/**
 * Prepare the web copies of the photographs.
 *
 * Photographs often arrive exported with white matting baked in, sometimes
 * with a thin decorative rule along one edge. In a gallery those sit as small
 * pictures floating inside white boxes while their neighbours go full bleed.
 *
 * sharp's own .trim() is not enough for that: a coloured rule is not white, so
 * it anchors the bounding box and the matting survives. Instead we find the
 * *longest contiguous run* of non-white rows and columns. A stray 3px rule
 * separated from the photograph by white is its own short run and gets dropped.
 *
 * The untouched originals stay in images/. Run with: pnpm images
 */
const sharp = require("sharp")
const fs = require("node:fs")
const path = require("node:path")

const MAX_EDGE = 1600
/** Greyscale mean at or above this counts as matting rather than picture. */
const WHITE = 238

/**
 * One entry per photograph, once the couple send them. For example:
 *
 *   { src: "images/portrait.jpg", out: "public/portrait.jpeg" },
 *   { src: "images/IMG_0001.jpg", out: "public/gallery/01.jpeg" },
 *
 * Add `noTrim: true` to leave a file's edges alone. Then point `portrait` and
 * `gallery` in data/wedding.ts at the `out` paths (without "public").
 */
const TARGETS = []

/** Start and length of the longest run of `true` in a boolean array. */
function longestRun(flags) {
  let bestStart = 0
  let bestLen = 0
  let start = -1

  for (let i = 0; i <= flags.length; i++) {
    if (i < flags.length && flags[i]) {
      if (start === -1) start = i
    } else if (start !== -1) {
      if (i - start > bestLen) {
        bestLen = i - start
        bestStart = start
      }
      start = -1
    }
  }
  return { start: bestStart, length: bestLen }
}

async function contentBox(input) {
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info

  const colHasContent = new Array(width).fill(false)
  const rowHasContent = new Array(height).fill(false)

  // A row or column counts as picture if a real share of it is not white -
  // a single dark pixel should not rescue a white margin.
  const colDark = new Array(width).fill(0)
  const rowDark = new Array(height).fill(0)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] < WHITE) {
        colDark[x]++
        rowDark[y]++
      }
    }
  }

  for (let x = 0; x < width; x++) colHasContent[x] = colDark[x] > height * 0.12
  for (let y = 0; y < height; y++) rowHasContent[y] = rowDark[y] > width * 0.12

  const cols = longestRun(colHasContent)
  const rows = longestRun(rowHasContent)

  return {
    left: cols.start,
    width: Math.max(1, cols.length),
    top: rows.start,
    height: Math.max(1, rows.length),
    fullWidth: width,
    fullHeight: height,
  }
}

async function main() {
  if (TARGETS.length === 0) {
    console.log("Nothing to prepare yet - list the photographs in TARGETS first.")
    return
  }

  const results = []
  let before = 0
  let after = 0

  for (const { src, out, noTrim } of TARGETS) {
    before += fs.statSync(src).size

    let pipeline = sharp(src)
    let note = "clean"

    if (!noTrim) {
      const box = await contentBox(src)
      const trimmed =
        box.width !== box.fullWidth || box.height !== box.fullHeight
      if (trimmed) {
        pipeline = sharp(src).extract({
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
        })
        note = `trimmed from ${box.fullWidth}x${box.fullHeight}`
      }
    }

    const tmp = out + ".tmp"
    await pipeline
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tmp)
    fs.renameSync(tmp, out)

    const final = await sharp(out).metadata()
    after += fs.statSync(out).size
    results.push({ out, w: final.width, h: final.height })

    console.log(
      `${path.basename(out).padEnd(24)} ${String(final.width).padStart(4)}x${String(
        final.height,
      ).padEnd(5)} ${note}`,
    )
  }

  console.log(`\n${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB\n`)
  console.log("Gallery dimensions for data/wedding.ts:")
  for (const r of results) {
    if (r.out.includes("gallery")) {
      console.log(`  ${r.out.replace("public", "")}  width: ${r.w}, height: ${r.h}`)
    }
  }

}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
