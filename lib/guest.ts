/**
 * What a guest has already told us about themselves, kept so they are not
 * asked for it again by the next form on the page.
 *
 * It lives in the guest's own browser and nowhere else. Nothing is looked up
 * from the sheet: a form that filled in a name from a phone number would hand
 * that name to anyone who typed the number.
 */

export type Guest = { name: string; phone: string; email: string }

const KEY = "oa-guest"

/** Forms already on the page when another one learns something new. */
const listeners = new Set<() => void>()

/** Private windows and blocked site data make storage throw; then nothing is remembered. */
export function recallGuest(): Partial<Guest> {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "{}")
    if (typeof raw !== "object" || raw === null) return {}

    const guest: Partial<Guest> = {}
    for (const field of ["name", "phone", "email"] as const) {
      if (typeof raw[field] === "string" && raw[field]) guest[field] = raw[field]
    }
    return guest
  } catch {
    return {}
  }
}

/** Adds to what is remembered. An empty value never wipes one already kept. */
export function rememberGuest(details: Partial<Guest>) {
  const guest = recallGuest()
  for (const field of ["name", "phone", "email"] as const) {
    const value = details[field]?.trim()
    if (value) guest[field] = value
  }

  try {
    window.localStorage.setItem(KEY, JSON.stringify(guest))
  } catch {
    return
  }
  listeners.forEach((listener) => listener())
}

/** Calls back whenever something new is remembered. Returns the unsubscribe. */
export function onGuestRemembered(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The same rule the RSVP form holds a phone number to. */
export function isPhone(value: string) {
  return value.replace(/[^0-9]/g, "").length >= 7
}
