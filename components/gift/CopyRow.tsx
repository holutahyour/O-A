"use client"

import { useEffect, useRef, useState } from "react"
import { copyText } from "@/lib/clipboard"

/**
 * One copyable line of the account block.
 *
 * The whole row is the button. A guest doing this one-handed at a reception
 * should not have to hit a 24px icon.
 */

type Props = {
  label: string
  /** The text actually copied. */
  value: string
  /** What the guest sees, if it differs from what gets copied (e.g. grouped). */
  display?: string
  /** Account numbers get the big tabular treatment. */
  emphasis?: boolean
}

export default function CopyRow({ label, value, display, emphasis = false }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  async function handleCopy() {
    const ok = await copyText(value)
    if (!ok) return
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex w-full items-center justify-between gap-4 rounded-lg border border-blush-200 bg-ivory px-4 py-3 text-left transition-colors hover:border-gold/60 hover:bg-blush-50"
    >
      <span className="min-w-0">
        <span className="eyebrow block">{label}</span>
        <span
          className={
            emphasis
              ? "tabular mt-1 block font-display text-2xl leading-tight text-wine sm:text-3xl"
              : "mt-0.5 block truncate font-ui text-[15px] text-ink"
          }
        >
          {display ?? value}
        </span>
      </span>

      <span
        className={`shrink-0 rounded-full px-3 py-1.5 font-ui text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
          copied
            ? "bg-wine text-ivory"
            : "bg-blush-200 text-wine group-hover:bg-champagne"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </span>

      {/* Colour alone is not feedback for everyone. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  )
}
