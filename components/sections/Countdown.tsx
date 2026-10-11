"use client"

import { useEffect, useState } from "react"
import { wedding } from "@/data/wedding"
import { remainingUntil, type Remaining } from "@/lib/countdown"
import { longDate } from "@/lib/format"
import Bloom from "@/components/motion/Bloom"
import Ornament from "@/components/motion/Ornament"

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const

export default function Countdown() {
  // The page is prerendered, so anything computed during render is frozen at
  // build time - and React 19 never patches text that differs on hydration,
  // which left stale day counts on screen. So the server and the first client
  // render both show placeholders, and the real numbers arrive after mount.
  const [left, setLeft] = useState<Remaining | null>(null)

  useEffect(() => {
    const tick = () => setLeft(remainingUntil(wedding.ceremonyAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const state = left?.state ?? "counting"

  return (
    <section className="section relative bg-blush-50">
      <div className="shell text-center">
        {state === "counting" && (
          <>
            <Bloom>
              <p className="eyebrow">
                Counting down to{" "}
                <span className="font-script text-[26px] normal-case tracking-normal text-gold">
                  Forever
                </span>
              </p>
            </Bloom>

            <Bloom order={1}>
              <div className="mt-8 flex items-stretch justify-center gap-1 sm:gap-6">
                {UNITS.map((unit, i) => (
                  <div key={unit.key} className="flex items-stretch">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="mr-1 w-px self-center bg-gold/35 sm:mr-6"
                        style={{ height: "3.2rem" }}
                      />
                    )}
                    <div className="min-w-[4.2rem] px-1 sm:min-w-[6rem]">
                      <span className="tabular block font-display text-[clamp(38px,11vw,72px)] font-light leading-none text-wine">
                        {left ? String(left[unit.key]).padStart(2, "0") : "--"}
                      </span>
                      <span className="eyebrow mt-3 block text-[9px] sm:text-[10px]">
                        {unit.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Bloom>

            <Bloom order={2}>
              <Ornament width={40} className="mt-9" />
              <p className="mt-5 font-display text-xl italic text-muted">
                {longDate(wedding.ceremonyAt)}
              </p>
            </Bloom>
          </>
        )}

        {state === "today" && (
          <Bloom>
            <p className="eyebrow">The day is here</p>
            <p className="mt-4 font-display text-[clamp(40px,10vw,76px)] font-light leading-none text-wine">
              Today
            </p>
            <Ornament width={44} className="mt-6" />
            <p className="mt-5 font-display text-xl italic text-muted">
              {wedding.couple.first} and {wedding.couple.second} are celebrating their{" "}
              {wedding.occasion.toLowerCase()}.
            </p>
          </Bloom>
        )}

        {state === "past" && (
          <Bloom>
            <p className="eyebrow">With every thanks to God</p>
            <p className="mt-4 font-display text-[clamp(34px,8vw,60px)] font-light leading-tight text-wine">
              Celebrated
            </p>
            <Ornament width={44} className="mt-6" />
            <p className="mt-5 font-display text-xl italic text-muted">
              {longDate(wedding.ceremonyAt)}
            </p>
          </Bloom>
        )}
      </div>
    </section>
  )
}
