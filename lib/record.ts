/**
 * Notes a gift or a headwear request in the couple's sheet as the guest is
 * handed over to WhatsApp.
 *
 * It never gets in the guest's way: nothing waits on it and a failure is
 * silent, because the WhatsApp message they are about to send says the same
 * thing. `keepalive` lets the request finish even when the phone switches
 * straight to the WhatsApp app.
 */

export type RecordEntry =
  | { type: "gift"; name: string; amount: number | null }
  | { type: "headwear"; name: string; gele: number; fila: number; total: number }

/** The last thing sent, so pressing the button twice does not write two rows. */
let last = ""

export function record(entry: RecordEntry) {
  const body = JSON.stringify(entry)
  if (body === last) return
  last = body

  fetch("/api/record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Let a later press try again.
    last = ""
  })
}
