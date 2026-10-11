/**
 * Countdown maths, kept away from React so it can be reasoned about (and
 * tested) on its own.
 *
 * The target is always a fixed UTC instant, so the result is identical whether
 * the guest is in Lagos, London, or Houston. Nothing here reads the browser's
 * timezone.
 */

export type CountdownState = "counting" | "today" | "past"

export type Remaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
  state: CountdownState
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** How long after the ceremony begins we keep saying "today". */
const CELEBRATION_WINDOW = 12 * HOUR

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 } as const

export function remainingUntil(targetIso: string, now: Date = new Date()): Remaining {
  const diff = new Date(targetIso).getTime() - now.getTime()

  if (diff <= 0) {
    // Never show negative numbers. Once the ceremony has begun we are either
    // still in the middle of the celebration, or it is behind us.
    return { ...ZERO, state: -diff < CELEBRATION_WINDOW ? "today" : "past" }
  }

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    state: "counting",
  }
}
