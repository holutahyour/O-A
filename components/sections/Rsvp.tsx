"use client"

import { useRef, useState, type FormEvent } from "react"
import { wedding } from "@/data/wedding"
import { dayAndMonth } from "@/lib/format"
import Bloom from "@/components/motion/Bloom"
import Ornament from "@/components/motion/Ornament"
import SectionHeading from "@/components/ui/SectionHeading"

type Attending = "Attending" | "Unable"

/**
 * Two things a guest can want from this one form: to be counted, or to be
 * counted *and* handed the invitation card. Both send the same details - only
 * what happens afterwards differs. "access" hands the guest over to WhatsApp
 * with the request already written, so the card comes back from the couple
 * themselves rather than off a public page.
 */
type Intent = "rsvp" | "access"

type Errors = Partial<Record<"name" | "phone" | "email", string>>

const ATTENDING: { value: Attending; label: string }[] = [
  { value: "Attending", label: "Joyfully attending" },
  { value: "Unable", label: "Unable to attend" },
]

const FIELD =
  "w-full rounded-lg border border-blush-200 bg-ivory px-4 py-3 font-ui text-[15px] text-ink " +
  "transition-colors placeholder:text-muted/60 hover:border-gold/50 focus:border-gold"

/**
 * The chat a guest asking for the card is handed off to, with the message
 * already written so all they have to do is press send.
 */
function whatsappHref(fields: { name: string; phone: string; attending: Attending }) {
  const label =
    ATTENDING.find((o) => o.value === fields.attending)?.label ?? fields.attending

  const text = `Hello, I have just sent my RSVP on ${wedding.couple.first} and ${wedding.couple.second}'s website and I would love a copy of the invitation card.

Name: ${fields.name}
Phone: ${fields.phone}
Attending: ${label}`

  return `https://wa.me/${wedding.whatsapp.number}?text=${encodeURIComponent(text)}`
}

function WhatsAppMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

export default function Rsvp() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [attending, setAttending] = useState<Attending>("Attending")
  const [message, setMessage] = useState("")

  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  /**
   * Which button was pressed. The ref is what the submit handler reads - a
   * click and a submit are two separate events, so a state value set in the
   * click would still be the old one inside this render's handler. The state
   * copy exists only so the pressed button can show "Sending…" on itself.
   */
  const intentRef = useRef<Intent>("rsvp")
  const [pressed, setPressed] = useState<Intent>("rsvp")

  /** Set only when the guest asked for the card, and only once we have saved. */
  const [waHref, setWaHref] = useState<string | null>(null)

  function choose(intent: Intent) {
    intentRef.current = intent
    setPressed(intent)
  }

  function validate(): Errors {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = "Please tell us your full name."
    if (phone.replace(/[^0-9]/g, "").length < 7)
      next.phone = "Please enter a phone number we can reach you on."
    if (email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      next.email = "That email address does not look right."
    return next
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const intent = intentRef.current
    setStatus("sending")
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          attending,
          message: message.trim(),
          requestedCard: intent === "access",
        }),
      })
      const data = await response.json().catch(() => ({ ok: false }))
      const ok = response.ok && data.ok

      if (ok && intent === "access") {
        const href = whatsappHref({
          name: name.trim(),
          phone: phone.trim(),
          attending,
        })
        setWaHref(href)
        // Hand the guest straight over to WhatsApp. A browser that has let the
        // click's user activation lapse while the request was in flight will
        // block this, which is why the thank-you screen carries the same link
        // as a button they can press themselves.
        window.open(href, "_blank", "noopener,noreferrer")
      } else {
        setWaHref(null)
      }

      setStatus(ok ? "sent" : "failed")
    } catch {
      setStatus("failed")
    }
  }

  if (status === "sent") {
    return (
      <section id="rsvp" className="section bg-blush-50">
        <div className="shell max-w-xl text-center">
          <Bloom>
            <p className="eyebrow">Thank you</p>
            <h2 className="mt-4 font-display text-[clamp(30px,7vw,48px)] font-light text-wine">
              We have you down!
            </h2>
            <Ornament width={44} className="mt-6" />
            <p className="mt-6 text-[16px] leading-relaxed text-ink">
              Thank you, {name.split(" ")[0]}. {wedding.couple.first} and{" "}
              {wedding.couple.second} cannot wait to celebrate with you on{" "}
              <span className="whitespace-nowrap">{dayAndMonth(wedding.ceremonyAt)}</span>.
            </p>
          </Bloom>

          {waHref && (
            <Bloom order={1}>
              <p className="eyebrow mt-14">Your invitation</p>
              <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-ink">
                WhatsApp should have opened with your request already written. Send it and
                we will reply with the invitation card ourselves.
              </p>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-wine px-8 py-4 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-wine-deep"
              >
                <WhatsAppMark />
                Open WhatsApp
              </a>

              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                It opens a chat with{" "}
                <span className="tabular whitespace-nowrap">{wedding.whatsapp.display}</span>
                . If nothing happened, tap the button above.
              </p>
            </Bloom>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="section bg-blush-50">
      <div className="shell max-w-2xl">
        <SectionHeading
          eyebrow="Kindly respond"
          title="RSVP"
          lead="Let us know you are coming so we can plan seating and catering properly. The earlier the better."
        />

        <Bloom order={1}>
          <form onSubmit={onSubmit} noValidate className="mt-12 space-y-5">
            <div>
              <label htmlFor="rsvp-name" className="eyebrow mb-2 block">
                Full name
              </label>
              <input
                id="rsvp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                className={`${FIELD} ${errors.name ? "border-wine" : ""}`}
              />
              {errors.name && (
                <p id="rsvp-name-error" className="mt-1.5 text-[13px] text-wine">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="rsvp-phone" className="eyebrow mb-2 block">
                  Phone number
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "rsvp-phone-error" : undefined}
                  className={`${FIELD} ${errors.phone ? "border-wine" : ""}`}
                />
                {errors.phone && (
                  <p id="rsvp-phone-error" className="mt-1.5 text-[13px] text-wine">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="rsvp-email" className="eyebrow mb-2 block">
                  Email <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "rsvp-email-error" : undefined}
                  className={`${FIELD} ${errors.email ? "border-wine" : ""}`}
                />
                {errors.email && (
                  <p id="rsvp-email-error" className="mt-1.5 text-[13px] text-wine">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="rsvp-attending" className="eyebrow mb-2 block">
                Will you join us?
              </label>
              <select
                id="rsvp-attending"
                value={attending}
                onChange={(e) => setAttending(e.target.value as Attending)}
                aria-describedby="rsvp-attending-note"
                className={FIELD}
              >
                {ATTENDING.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <p id="rsvp-attending-note" className="mt-1.5 text-[13px] text-muted">
                Children are not allowed. Thank you for understanding.
              </p>
            </div>

            <div>
              <label htmlFor="rsvp-message" className="eyebrow mb-2 block">
                A message for the couple{" "}
                <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                id="rsvp-message"
                rows={4}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${FIELD} resize-y`}
              />
              <p className="tabular mt-1.5 text-right text-[12px] text-muted">
                {message.length}/500
              </p>
            </div>

            {status === "failed" && (
              <div
                role="alert"
                className="rounded-lg border border-wine/30 bg-wine/5 px-4 py-3.5 text-[14px] leading-relaxed text-ink"
              >
                We could not send that just now. Please try again, or call{" "}
                {wedding.rsvpPhones.map((p, i) => (
                  <span key={p.tel}>
                    {i > 0 && " or "}
                    <a
                      href={`tel:${p.tel}`}
                      className="tabular font-medium text-wine underline decoration-gold/50 underline-offset-2"
                    >
                      {p.display}
                    </a>
                  </span>
                ))}{" "}
                and we will add you by hand.
              </div>
            )}

            {/* One set of details, two intents. Both buttons submit the same
                form; "Send and request access" additionally opens WhatsApp so
                the couple can send the invitation card back personally. */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                onClick={() => choose("rsvp")}
                disabled={status === "sending"}
                className="w-full rounded-full bg-wine px-8 py-4 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-wine-deep disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "sending" && pressed === "rsvp" ? "Sending…" : "Send RSVP"}
              </button>

              <button
                type="submit"
                onClick={() => choose("access")}
                disabled={status === "sending"}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-gold/60 px-8 py-4 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-wine transition-colors hover:border-gold hover:bg-champagne/30 disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "sending" && pressed === "access" ? (
                  "Sending…"
                ) : (
                  <>
                    <WhatsAppMark />
                    Send and request access
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[13px] leading-relaxed text-muted">
              Send and request access passes your details through, then opens WhatsApp with
              your request already written, so we can send you the invitation card
              ourselves.
            </p>
          </form>
        </Bloom>

        <Bloom order={2}>
          <p className="mt-10 text-center text-[14px] leading-relaxed text-muted">
            Would rather call? Reach us on{" "}
            {wedding.rsvpPhones.map((p, i) => (
              <span key={p.tel}>
                {i > 0 && " or "}
                <a
                  href={`tel:${p.tel}`}
                  className="tabular font-medium text-wine underline decoration-gold/50 underline-offset-4"
                >
                  {p.display}
                </a>
              </span>
            ))}
            .
          </p>
        </Bloom>
      </div>
    </section>
  )
}
