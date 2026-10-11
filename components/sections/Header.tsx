"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { wedding } from "@/data/wedding"
import { useGiftSheet } from "@/components/gift/GiftSheet"

const LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#the-day", label: "The Day" },
  { href: "#stay", label: "Stay" },
  { href: "#rsvp", label: "RSVP" },
]

export default function Header() {
  const [shown, setShown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { open } = useGiftSheet()

  useEffect(() => {
    function onScroll() {
      setShown(window.scrollY > window.innerHeight * 0.75)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  return (
    <AnimatePresence>
      {shown && (
        <motion.header
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-40 border-b border-blush-200/70 bg-ivory/90 backdrop-blur-md"
        >
          <nav
            aria-label="Primary"
            className="shell flex h-16 items-center justify-between gap-4"
          >
            <a
              href="#top"
              className="font-display text-2xl leading-none tracking-wide text-wine"
            >
              {wedding.couple.monogram}
            </a>

            <ul className="hidden items-center gap-8 md:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-ui text-[11px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-wine"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => open()}
                className="rounded-full bg-wine px-5 py-2.5 font-ui text-[10px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-wine-deep"
              >
                Bless the Couple
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="rounded-full p-2 text-wine transition-colors hover:bg-blush-50 md:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  {menuOpen ? (
                    <path
                      d="M3 3l12 12M15 3L3 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M2 5h14M2 9h14M2 13h14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-blush-200/70 md:hidden"
              >
                <ul className="shell flex flex-col py-2">
                  {LINKS.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-3 font-ui text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-wine"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
