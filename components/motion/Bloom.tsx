"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

/**
 * The section reveal: content washes into view the way ink blooms on wet paper:
 * a soft lift paired with a fade, once, when it first scrolls in.
 *
 * Under prefers-reduced-motion this collapses to a plain fade with no movement.
 */

type Props = {
  children: ReactNode
  /** Stagger position - each step adds 90ms. */
  order?: number
  className?: string
  as?: "div" | "section" | "li" | "article" | "header" | "footer"
}

export default function Bloom({ children, order = 0, className, as = "div" }: Props) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        reduced
          ? { duration: 0.15 }
          : { duration: 0.9, delay: order * 0.09, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </Component>
  )
}
