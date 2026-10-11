"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * The one ornament that repeats down the whole page: a small blossom with a
 * leafed stem curving away on either side, lifted from the card's bouquets.
 * Using a single repeated separator everywhere is most of what makes the page
 * feel like one designed object rather than a stack of unrelated blocks.
 */

type Props = {
  /** Length of each stem. */
  width?: number
  className?: string
  tone?: "gold" | "ivory"
}

const PETALS = [0, 72, 144, 216, 288]

/** One stem, drawn growing to the right of the blossom. */
function Stem({ stroke, leaf }: { stroke: string; leaf: string }) {
  return (
    <g>
      <path
        d="M8 0C20 -5 34 5 50 0"
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M20 -2.2C24 -8 31 -8 34 -3.4C29 -1.4 24 -1 20 -2.2Z" fill={leaf} />
      <path d="M33 2.6C37 7.6 43 7.4 46 2.2C41 1 37 1.2 33 2.6Z" fill={leaf} />
    </g>
  )
}

export default function Ornament({ width = 56, className = "", tone = "gold" }: Props) {
  const reduced = useReducedMotion()

  const ivory = tone === "ivory"
  const stroke = ivory ? "rgba(255,250,253,0.55)" : "var(--color-gold)"
  const leaf = ivory ? "rgba(255,250,253,0.45)" : "var(--color-sage)"
  const petal = ivory ? "rgba(255,250,253,0.8)" : "var(--color-blush-400)"
  const heart = ivory ? "var(--color-wine-deep)" : "var(--color-ivory)"

  // The drawing is 108 units wide; `width` sets how long each stem renders.
  const scale = width / 50

  return (
    <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      <motion.svg
        width={108 * scale}
        height={20 * scale}
        viewBox="-54 -10 108 20"
        fill="none"
        initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ flexShrink: 0, minWidth: 64 }}
      >
        <Stem stroke={stroke} leaf={leaf} />
        <g transform="scale(-1 1)">
          <Stem stroke={stroke} leaf={leaf} />
        </g>
        {PETALS.map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-3.4"
            rx="2.3"
            ry="3.4"
            fill={petal}
            fillOpacity="0.85"
            transform={`rotate(${a})`}
          />
        ))}
        <circle r="1.3" fill={heart} />
      </motion.svg>
    </div>
  )
}
