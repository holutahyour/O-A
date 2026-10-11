"use client"

import { motion, useReducedMotion } from "framer-motion"
import { wedding } from "@/data/wedding"
import { dateParts } from "@/lib/format"

/**
 * What the hero arch holds until the couple's portrait arrives.
 *
 * It has to carry the weight a photograph would, so it is not a pale
 * placeholder: the arch is a deep plum night, and the card's flowers open into
 * it one after another when the page loads, then keep turning very slowly.
 * The date sits in the clearing between the two bouquets. A photograph cannot
 * bloom, which is the point - this should feel chosen, not missing.
 *
 * Set `portrait` in data/wedding.ts and the hero shows the photograph instead.
 */

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315]

const PINK = "var(--color-blush-400)"
const LILAC = "var(--color-champagne-deep)"
const ORCHID = "var(--color-gold-soft)"
const IVORY = "var(--color-ivory)"
const SAGE = "var(--color-sage)"

type Bloom = { x: number; y: number; r: number; petal: string; heart: string }
type LeafShape = { x: number; y: number; length: number; turn: number }

/* Drawn on a 300 x 400 board, the arch's own 3:4. The bouquets hold the
   top-right and bottom-left, as they do on the printed card; listed largest
   first so the small flowers open last, on top. */
const BLOOMS: Bloom[] = [
  { x: 236, y: 82, r: 62, petal: ORCHID, heart: IVORY },
  { x: 60, y: 334, r: 64, petal: PINK, heart: IVORY },
  { x: 274, y: 162, r: 42, petal: PINK, heart: IVORY },
  { x: 134, y: 378, r: 42, petal: LILAC, heart: "var(--color-wine)" },
  { x: 168, y: 34, r: 36, petal: LILAC, heart: "var(--color-wine)" },
  { x: 24, y: 248, r: 36, petal: ORCHID, heart: IVORY },
  { x: 276, y: 236, r: 17, petal: IVORY, heart: PINK },
  { x: 26, y: 190, r: 17, petal: IVORY, heart: PINK },
  { x: 112, y: 30, r: 18, petal: PINK, heart: IVORY },
  { x: 196, y: 386, r: 19, petal: ORCHID, heart: IVORY },
]

const LEAVES: LeafShape[] = [
  { x: 236, y: 90, length: 92, turn: 162 },
  { x: 250, y: 104, length: 84, turn: 112 },
  { x: 180, y: 44, length: 60, turn: 200 },
  { x: 60, y: 326, length: 92, turn: -18 },
  { x: 48, y: 312, length: 84, turn: -68 },
  { x: 120, y: 368, length: 64, turn: 20 },
]

const SPARKS = [
  { x: 150, y: 96, r: 1.6 },
  { x: 92, y: 118, r: 1.2 },
  { x: 58, y: 180, r: 1.8 },
  { x: 232, y: 232, r: 1.4 },
  { x: 258, y: 300, r: 1.8 },
  { x: 214, y: 322, r: 1.2 },
  { x: 176, y: 262, r: 1 },
  { x: 126, y: 214, r: 1 },
]

function Flower({ r, petal, heart }: { r: number; petal: string; heart: string }) {
  return (
    <>
      {/* Two rings of translucent petals, the inner one offset, so the colour
          pools where they overlap the way watercolour does. */}
      {PETALS.map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy={-r * 0.6}
          rx={r * 0.27}
          ry={r * 0.56}
          fill={petal}
          fillOpacity="0.6"
          transform={`rotate(${a})`}
        />
      ))}
      {PETALS.map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy={-r * 0.34}
          rx={r * 0.17}
          ry={r * 0.34}
          fill={petal}
          fillOpacity="0.75"
          transform={`rotate(${a + 22.5})`}
        />
      ))}
      <circle r={r * 0.13} fill={heart} />
    </>
  )
}

export default function ArchBloom() {
  const reduced = useReducedMotion()
  const { day, month, year } = dateParts(wedding.ceremonyAt)

  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 85% 60% at 50% 46%, #7a3169 0%, var(--color-wine) 48%, var(--color-wine-deep) 100%)",
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {LEAVES.map((leaf, i) => {
          const w = leaf.length * 0.26
          return (
            <motion.path
              key={i}
              d={`M0 0C${leaf.length * 0.3} ${-w} ${leaf.length * 0.75} ${-w} ${leaf.length} 0C${leaf.length * 0.75} ${w} ${leaf.length * 0.3} ${w} 0 0Z`}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.turn})`}
              fill={SAGE}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.5 + i * 0.1 }}
            />
          )
        })}

        {BLOOMS.map((bloom, i) => (
          <g key={i} transform={`translate(${bloom.x} ${bloom.y})`}>
            {/* Opening: each flower unfurls a beat after the one before. */}
            <motion.g
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.2, rotate: -70 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: reduced ? 0.2 : 1.6,
                delay: reduced ? 0 : 0.6 + i * 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* And then never quite still. */}
              <motion.g
                animate={reduced ? undefined : { rotate: i % 2 ? [0, 9, 0] : [0, -9, 0] }}
                transition={{ duration: 14 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flower r={bloom.r} petal={bloom.petal} heart={bloom.heart} />
              </motion.g>
            </motion.g>
          </g>
        ))}

        {SPARKS.map((spark, i) => (
          <motion.circle
            key={i}
            cx={spark.x}
            cy={spark.y}
            r={spark.r}
            fill={IVORY}
            initial={{ opacity: reduced ? 0.5 : 0 }}
            animate={reduced ? undefined : { opacity: [0, 0.9, 0] }}
            transition={{
              duration: 3.2 + (i % 3),
              delay: 1.8 + i * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* ── The clearing ───────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.2 : 1.4, delay: reduced ? 0 : 1.1 }}
      >
        <p className="eyebrow text-champagne">Save the date</p>
        <p className="tabular lining-nums mt-1 font-display text-[clamp(86px,25vw,156px)] font-light leading-none text-ivory">
          {day}
        </p>
        <p className="-mt-2 font-script text-[clamp(40px,11vw,62px)] leading-none text-gold-soft">
          {month}
        </p>
        <p className="tabular mt-3 font-ui text-[12px] font-medium uppercase tracking-[0.34em] text-ivory">
          {year}
        </p>
        <span aria-hidden="true" className="mt-4 block h-px w-10 bg-champagne/60" />
        <p className="eyebrow mt-4 text-champagne">{wedding.venue.time}</p>
      </motion.div>
    </div>
  )
}
