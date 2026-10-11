/**
 * Soft, out-of-focus light drifting slowly upward.
 *
 * This is the site's ambient motion signature. It is deliberately NOT falling
 * petals - that belongs to the invitation this site took inspiration from, and
 * reusing it would make this read as a copy.
 *
 * The mote positions come from a seeded generator rather than Math.random, so
 * the server and the client agree and React never reports a hydration
 * mismatch. Under prefers-reduced-motion the whole thing vanishes (see
 * globals.css) - no JavaScript needed to switch it off.
 */

const MOTE_COUNT = 20
/** Motes past this index are hidden on small screens to keep phones light. */
const MOBILE_LIMIT = 12

/** Deterministic PRNG (mulberry32) so SSR and CSR produce identical markup. */
function seeded(seed: number) {
  return function next() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Each gradient fades to a zero-alpha copy of its own colour rather than to
 * `transparent`, which some renderers interpolate as transparent *black* and
 * turn into a grey halo.
 */
const TINTS = [
  ["rgba(199,127,162,0.7)", "rgba(199,127,162,0)"], // onion pink
  ["rgba(207,180,226,0.7)", "rgba(207,180,226,0)"], // lilac
  ["rgba(214,166,201,0.6)", "rgba(214,166,201,0)"], // soft orchid
]

const motes = (() => {
  const rand = seeded(20261205)
  return Array.from({ length: MOTE_COUNT }, (_, i) => {
    const size = Math.round(140 + rand() * 220)
    return {
      id: i,
      size,
      left: Math.round(rand() * 100),
      drift: Math.round((rand() - 0.5) * 160),
      duration: Math.round(40 + rand() * 50),
      delay: Math.round(rand() * 45),
      opacity: (0.05 + rand() * 0.07).toFixed(3),
      // Blur has to scale with the mote, otherwise a large circle keeps a
      // visible edge and reads as a watermark disc rather than as light.
      blur: Math.round(size * 0.42),
      tint: TINTS[i % TINTS.length],
    }
  })
})()

export default function Bokeh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {motes.map((m) => (
        <span
          key={m.id}
          className={`bokeh-mote ${m.id >= MOBILE_LIMIT ? "hidden sm:block" : "block"}`}
          style={
            {
              width: m.size,
              height: m.size,
              left: `${m.left}%`,
              background: `radial-gradient(circle at 38% 36%, ${m.tint[0]} 0%, ${m.tint[1]} 72%)`,
              filter: `blur(${m.blur}px)`,
              "--bokeh-drift": `${m.drift}px`,
              "--bokeh-duration": `${m.duration}s`,
              "--bokeh-delay": `-${m.delay}s`,
              "--bokeh-opacity": m.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
