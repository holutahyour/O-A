"use client"

import { useState } from "react"
import { wedding } from "@/data/wedding"
import { naira } from "@/lib/format"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"

/**
 * Gele and fila requests.
 *
 * Nothing is stored and nothing is paid for here. A guest picks how many of
 * each they want, and the button opens WhatsApp on the primary line with the
 * request already written - the family take it from there.
 */

const STEP =
  "flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-wine " +
  "transition-colors hover:border-gold hover:bg-champagne/30 disabled:pointer-events-none disabled:opacity-35"

const MAX = 20

export default function Headwear() {
  const [name, setName] = useState("")
  const [counts, setCounts] = useState<Record<string, number>>({})

  if (wedding.headwear.length === 0) return null

  const chosen = wedding.headwear
    .map((item) => ({ ...item, count: counts[item.id] ?? 0 }))
    .filter((item) => item.count > 0)
  const total = chosen.reduce((sum, item) => sum + item.count * item.price, 0)

  function change(id: string, by: number) {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.min(MAX, Math.max(0, (prev[id] ?? 0) + by)),
    }))
  }

  const text = `Hello, I would like to request the following for ${wedding.couple.first} and ${wedding.couple.second}'s ${wedding.occasion.toLowerCase()}:

${chosen.map((item) => `${item.name} x ${item.count} - ${naira(item.count * item.price)}`).join("\n")}

Total: ${naira(total)}
Name: ${name.trim()}`

  const href = `https://wa.me/${wedding.whatsapp.number}?text=${encodeURIComponent(text)}`
  const ready = chosen.length > 0

  return (
    <section id="headwear" className="section relative">
      <div className="shell max-w-3xl">
        <SectionHeading
          eyebrow="Dress the part"
          title="Gele & Fila"
          lead="Would you like a gele or a fila for the day? Choose how many and send us your request."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {wedding.headwear.map((item, i) => {
            const count = counts[item.id] ?? 0
            return (
              <Bloom
                as="article"
                key={item.id}
                order={i}
                className="rounded-2xl border border-blush-200 bg-ivory p-7 text-center"
              >
                <h3 className="font-display text-[26px] font-normal leading-tight text-wine">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{item.note}</p>
                <p className="tabular mt-4 font-ui text-[15px] font-medium tracking-[0.06em] text-wine">
                  {naira(item.price)} <span className="font-normal text-muted">each</span>
                </p>

                <div className="mt-5 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => change(item.id, -1)}
                    disabled={count === 0}
                    aria-label={`One fewer ${item.name}`}
                    className={STEP}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span
                    aria-live="polite"
                    aria-label={`${count} ${item.name}`}
                    className="tabular w-8 font-display text-[28px] text-wine"
                  >
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => change(item.id, 1)}
                    disabled={count === MAX}
                    aria-label={`One more ${item.name}`}
                    className={STEP}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M2 7h10M7 2v10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </Bloom>
            )
          })}
        </div>

        <Bloom order={2} className="mx-auto mt-8 max-w-md">
          <label htmlFor="headwear-name" className="eyebrow mb-2 block">
            Your name
          </label>
          <input
            id="headwear-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-lg border border-blush-200 bg-ivory px-4 py-3 font-ui text-[15px] text-ink transition-colors placeholder:text-muted/60 hover:border-gold/50 focus:border-gold"
          />

          <p className="tabular mt-6 text-center font-ui text-[15px] text-ink" aria-live="polite">
            {ready ? (
              <>
                Total <span className="font-medium text-wine">{naira(total)}</span>
              </>
            ) : (
              <span className="text-muted">Choose at least one to send a request.</span>
            )}
          </p>

          <a
            href={ready ? href : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ready}
            className={`mt-4 flex w-full items-center justify-center rounded-full bg-wine px-8 py-4 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-wine-deep ${
              ready ? "" : "pointer-events-none opacity-50"
            }`}
          >
            Request on WhatsApp
          </a>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-muted">
            This opens a chat with{" "}
            <span className="tabular whitespace-nowrap">{wedding.whatsapp.display}</span> with
            your request already written. We will reply with how to pay and collect.
          </p>
        </Bloom>
      </div>
    </section>
  )
}
