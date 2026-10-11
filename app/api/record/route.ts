import { NextResponse } from "next/server"

/**
 * Keeps a note, in the couple's Google Sheet, of two things guests do on
 * WhatsApp rather than on the site: saying they have sent a gift, and asking
 * for a gele or fila. The same Apps Script that takes RSVPs files each one in
 * its own tab - see docs/APPS-SCRIPT.md.
 *
 * These rows are what a guest said, not proof of anything. A gift row is not
 * a bank alert, and a headwear row is not a payment.
 */

type Entry =
  | { type: "gift"; name: string; phone: string; amount: number | null }
  | {
      type: "headwear"
      name: string
      phone: string
      gele: number
      fila: number
      total: number
    }

const MAX_EACH = 20
const MAX_AMOUNT = 1_000_000_000

function count(value: unknown): number | null {
  const n = Number(value ?? 0)
  return Number.isInteger(n) && n >= 0 && n <= MAX_EACH ? n : null
}

function validate(body: unknown): { ok: true; data: Entry } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Malformed request." }
  }

  const raw = body as Record<string, unknown>
  const name = String(raw.name ?? "").trim()
  if (name.length < 2 || name.length > 120) return { ok: false, error: "Invalid name." }

  // The same rule as an RSVP, so a row here can be matched to one there.
  const phone = String(raw.phone ?? "").trim()
  if (phone.replace(/[^0-9]/g, "").length < 7 || phone.length > 40) {
    return { ok: false, error: "Invalid phone number." }
  }

  if (raw.type === "gift") {
    if (raw.amount === null || raw.amount === undefined || raw.amount === "") {
      return { ok: true, data: { type: "gift", name, phone, amount: null } }
    }
    const amount = Number(raw.amount)
    if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
      return { ok: false, error: "Invalid amount." }
    }
    return { ok: true, data: { type: "gift", name, phone, amount } }
  }

  if (raw.type === "headwear") {
    const gele = count(raw.gele)
    const fila = count(raw.fila)
    const total = Number(raw.total)
    if (gele === null || fila === null || gele + fila === 0) {
      return { ok: false, error: "Invalid quantities." }
    }
    if (!Number.isFinite(total) || total < 0 || total > MAX_AMOUNT) {
      return { ok: false, error: "Invalid total." }
    }
    return { ok: true, data: { type: "headwear", name, phone, gele, fila, total } }
  }

  return { ok: false, error: "Unknown record type." }
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
    console.error("[record] RSVP_ENDPOINT is not set; nothing was recorded.")
    return NextResponse.json({ ok: false, error: "Not connected yet." }, { status: 503 })
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...result.data, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    })

    const saved = upstream.ok
      ? ((await upstream.json().catch(() => null)) as { ok?: boolean } | null)
      : null

    if (!saved?.ok) {
      console.error("[record] upstream did not save", upstream.status, saved)
      return NextResponse.json({ ok: false, error: "Could not save." }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[record] upstream request failed", error)
    return NextResponse.json({ ok: false, error: "Could not save." }, { status: 502 })
  }
}
