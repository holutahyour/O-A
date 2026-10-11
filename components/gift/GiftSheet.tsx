"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { wedding, hasBankDetails } from "@/data/wedding"
import { groupAccountNumber } from "@/lib/format"
import CopyRow from "./CopyRow"
import Ornament from "@/components/motion/Ornament"

/**
 * The "bless the couple" sheet.
 *
 * It is built around one question: how few taps until the money has actually
 * moved? The answer is two. Open the sheet, tap copy on the account number.
 * Everything else here is supporting material.
 *
 * Nothing a guest types is stored or transmitted. There is no payment
 * processor. The site's only job is to hand over an account number cleanly and
 * then get out of the way.
 */

type GiftSheetContext = { open: () => void }

const Ctx = createContext<GiftSheetContext | null>(null)

export function useGiftSheet(): GiftSheetContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useGiftSheet must be used inside <GiftSheetProvider>")
  return ctx
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function GiftSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  const open = useCallback(() => {
    returnTo.current = document.activeElement as HTMLElement | null
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Send focus back where it came from, so the keyboard path is not broken.
    returnTo.current?.focus?.()
  }, [])

  /* Scroll lock, focus move, focus trap, and Escape - all while open. */
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const panel = panelRef.current
    panel?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== "Tab" || !panel) return

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      )
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, close])

  const value = useMemo(() => ({ open }), [open])

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && <Sheet onClose={close} panelRef={panelRef} reduced={!!reduced} />}
      </AnimatePresence>
    </Ctx.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */

function Sheet({
  onClose,
  panelRef,
  reduced,
}: {
  onClose: () => void
  panelRef: React.RefObject<HTMLDivElement | null>
  reduced: boolean
}) {
  const names = `${wedding.couple.first} and ${wedding.couple.second}`
  const message = `Hello! I have just sent a gift to bless ${names}. My name is `
  const whatsapp = `https://wa.me/${wedding.whatsapp.number}?text=${encodeURIComponent(message)}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <motion.div
        className="absolute inset-0 bg-wine-deep/45 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-sheet-title"
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-ivory p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: reduced ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted transition-colors hover:bg-blush-50 hover:text-wine"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="pr-8">
          <p className="eyebrow">With love</p>
          <h2
            id="gift-sheet-title"
            className="mt-1 font-display text-3xl font-normal text-wine"
          >
            Bless the Couple
          </h2>
        </div>

        <Ornament width={40} className="mt-5" />

        <p className="mt-6 text-[15px] leading-relaxed text-ink">
          Gifts are received as bank transfers. Thank you for blessing {names}.
        </p>

        {/* ── The account block ──────────────────────────────────────────── */}
        {hasBankDetails ? (
          <div className="mt-5 space-y-2.5">
            <CopyRow label="Account name" value={wedding.bank.accountName} />
            <CopyRow label="Bank" value={wedding.bank.bankName} />
            <CopyRow
              label="Account number"
              value={wedding.bank.accountNumber}
              display={groupAccountNumber(wedding.bank.accountNumber)}
              emphasis
            />
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-champagne bg-champagne/25 p-5">
            <p className="font-display text-xl text-wine">Account details coming soon</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink">
              The couple are finalising this. In the meantime, please call either number
              below and they will share the details with you directly.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {wedding.rsvpPhones.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="tabular font-ui text-[15px] font-medium text-wine underline decoration-gold/50 underline-offset-4"
                >
                  {p.display}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Guests sending from abroad ─────────────────────────────────── */}
        {wedding.bank.international && (
          <div className="mt-5 rounded-xl border border-blush-200 p-4">
            <p className="eyebrow mb-3">Sending from abroad</p>
            <div className="space-y-2.5">
              <CopyRow
                label={`Account name (${wedding.bank.international.currency})`}
                value={wedding.bank.international.accountName}
              />
              <CopyRow label="Bank" value={wedding.bank.international.bank} />
              {wedding.bank.international.accountNumber && (
                <CopyRow
                  label="Account number"
                  value={wedding.bank.international.accountNumber}
                />
              )}
              {wedding.bank.international.sortCode && (
                <CopyRow label="Sort code" value={wedding.bank.international.sortCode} />
              )}
              {wedding.bank.international.iban && (
                <CopyRow label="IBAN" value={wedding.bank.international.iban} />
              )}
              {wedding.bank.international.swift && (
                <CopyRow label="SWIFT / BIC" value={wedding.bank.international.swift} />
              )}
            </div>
          </div>
        )}

        {/* Confirming a transfer and vouching for the account only make sense
            once there is an account on the sheet to send to. */}
        {hasBankDetails && (
          <>
            {/* ── Telling the couple ─────────────────────────────────────────── */}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-wine px-6 py-4 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-wine-deep"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.43 1.32-1.99 1.4-.53.08-1.17.11-1.89-.12-.44-.14-1-.32-1.72-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11s.78-2.21 1.05-2.51c.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.18 0 .43-.07.68.52.25.6.85 2.08.93 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.34 1.44.3.15.47.13.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.07.12.07.72-.18 1.41Z" />
              </svg>
              I have sent my gift
            </a>
            <p className="mt-2 text-center text-[13px] text-muted">
              This opens WhatsApp so the family know your gift arrived.
            </p>

            {/* ── The notice that costs one sentence and saves a lot ─────────── */}
            <div className="mt-6 flex gap-3 rounded-xl bg-blush-50 p-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5 shrink-0 text-wine"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M8 4.75v4M8 11.1v.1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-[13px] leading-relaxed text-ink">
                These are the only accounts for this celebration. If anyone sends you different
                details, please call{" "}
                <a
                  href={`tel:${wedding.rsvpPhones[0].tel}`}
                  className="tabular font-medium text-wine underline decoration-gold/50 underline-offset-2"
                >
                  {wedding.rsvpPhones[0].display}
                </a>{" "}
                to confirm before sending anything.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
