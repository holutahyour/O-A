"use client"

import { useGiftSheet } from "./GiftSheet"

/** The one button that opens the account details. */
export default function GiftCta() {
  const { open } = useGiftSheet()

  return (
    <button
      type="button"
      onClick={() => open()}
      className="rounded-full bg-wine px-9 py-4 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-ivory shadow-[0_10px_30px_-12px_rgba(92,35,80,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-deep"
    >
      Bless the couple
    </button>
  )
}
