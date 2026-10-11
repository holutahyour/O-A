/** Formatting helpers. Every date is rendered in Lagos time. */

const LAGOS = "Africa/Lagos"

/**
 * The date, written out in full, in Lagos time.
 * The weekday is derived rather than typed by hand - nobody should be
 * hardcoding "Saturday" and hoping.
 */
export function longDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

/** "5 December" - for a sentence that already knows the year. */
export function dayAndMonth(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS,
    day: "numeric",
    month: "long",
  }).format(new Date(iso))
}

function parts(iso: string, options: Intl.DateTimeFormatOptions) {
  const found = new Intl.DateTimeFormat("en-GB", { timeZone: LAGOS, ...options }).formatToParts(
    new Date(iso),
  )
  return (type: Intl.DateTimeFormatPartTypes) => found.find((p) => p.type === type)?.value ?? ""
}

/** "05 · 12 · 2026" - the hero's typographic treatment of the date. */
export function dottedDate(iso: string): string {
  const get = parts(iso, { day: "2-digit", month: "2-digit", year: "numeric" })
  return [get("day"), get("month"), get("year")].join(" · ")
}

/** The date in pieces - "05", "December", "2026" - for the hero's date seal. */
export function dateParts(iso: string): { day: string; month: string; year: string } {
  const get = parts(iso, { day: "2-digit", month: "long", year: "numeric" })
  return { day: get("day"), month: get("month"), year: get("year") }
}

/** 15000 -> "₦15,000" */
export function naira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

/**
 * Account numbers are read aloud and typed by hand, often by someone holding a
 * phone in one hand. Grouping them in threes makes that meaningfully easier.
 * "0123456789" -> "012 345 6789"
 */
export function groupAccountNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, "")
  if (digits.length !== 10) return value
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
