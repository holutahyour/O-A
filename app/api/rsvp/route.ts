import { NextResponse } from "next/server"

/**
 * RSVP submissions are forwarded to a Google Apps Script web app, which appends
 * a row to the couple's Google Sheet. See docs/APPS-SCRIPT.md for the script
 * and how to deploy it.
 *
 * Going through this route rather than posting from the browser keeps the
 * endpoint out of the client bundle and sidesteps CORS entirely.
 */

const ATTENDING = new Set(["Attending", "Unable"])

type Payload = {
  name: string
  phone: string
  email: string
  attending: string
  message: string
  /** True when the guest asked for the invitation card, not just to be counted. */
  requestedCard: boolean
}

/**
 * Phones and emails this server has already taken an RSVP from, so a repeat is
 * turned away without a trip to the sheet.
 *
 * This is a shortcut, not the record. It empties whenever the server restarts
 * and is not shared between instances, so the Apps Script makes the same check
 * against the sheet itself - that one is the check that counts.
 */
const seen = new Set<string>()

/**
 * The same guest writes their number as 0807…, +234 807… or 234807…, so a
 * phone is compared on its last ten digits. The Apps Script uses the same rule.
 */
function keysFor(data: Payload): string[] {
  const keys = [`phone:${data.phone.replace(/[^0-9]/g, "").slice(-10)}`]
  if (data.email) keys.push(`email:${data.email.toLowerCase()}`)
  return keys
}

function duplicate() {
  return NextResponse.json(
    { ok: false, duplicate: true, error: "Already responded." },
    { status: 409 },
  )
}

function validate(body: unknown): { ok: true; data: Payload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Malformed request." }
  }

  const raw = body as Record<string, unknown>
  const name = String(raw.name ?? "").trim()
  const phone = String(raw.phone ?? "").trim()
  const email = String(raw.email ?? "").trim()
  const attending = String(raw.attending ?? "").trim()
  const message = String(raw.message ?? "").trim()
  const requestedCard = raw.requestedCard === true

  if (name.length < 2 || name.length > 120) return { ok: false, error: "Invalid name." }
  if (phone.replace(/[^0-9]/g, "").length < 7 || phone.length > 40) {
    return { ok: false, error: "Invalid phone number." }
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Invalid email address." }
  }
  if (!ATTENDING.has(attending)) return { ok: false, error: "Invalid attendance choice." }
  if (message.length > 500) return { ok: false, error: "Message is too long." }

  return {
    ok: true,
    data: { name, phone, email, attending, message, requestedCard },
  }
}

export async function POST(request: Request) {
  const endpoint = process.env.RSVP_ENDPOINT

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 })
  }

  const result = validate(body)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
  }

  if (!endpoint) {
    // No Sheet wired up yet. Fail honestly and loudly rather than pretending
    // the RSVP was recorded - the guest is then told to call instead.
    console.error("[rsvp] RSVP_ENDPOINT is not set; submission was not recorded.")
    return NextResponse.json(
      { ok: false, error: "RSVP is not connected yet." },
      { status: 503 },
    )
  }

  const keys = keysFor(result.data)
  if (keys.some((key) => seen.has(key))) return duplicate()

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...result.data, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!upstream.ok) {
      console.error("[rsvp] upstream responded", upstream.status)
      return NextResponse.json({ ok: false, error: "Could not save." }, { status: 502 })
    }

    // The script answers 200 even when it turns a row away, so the body is
    // what says whether the RSVP was saved.
    const saved = (await upstream.json().catch(() => null)) as {
      ok?: boolean
      duplicate?: boolean
    } | null

    if (saved?.duplicate) {
      keys.forEach((key) => seen.add(key))
      return duplicate()
    }
    if (!saved?.ok) {
      console.error("[rsvp] upstream did not save", saved)
      return NextResponse.json({ ok: false, error: "Could not save." }, { status: 502 })
    }

    keys.forEach((key) => seen.add(key))
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[rsvp] upstream request failed", error)
    return NextResponse.json({ ok: false, error: "Could not save." }, { status: 502 })
  }
}
