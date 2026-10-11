"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"

export default function Gallery() {
  const images = wedding.gallery
  const [index, setIndex] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (index === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [index, close, step])

  // An empty gallery hides the section rather than rendering empty frames.
  if (images.length === 0) return null

  return (
    <section id="gallery" className="section relative">
      <div className="shell">
        <SectionHeading eyebrow="Before the day" title="Photographs" />

        {/* A uniform 3:4 grid rather than masonry. The photographs no longer
            share one aspect ratio once their matting was trimmed, and a ragged
            masonry bottom read as misalignment. Thumbnails crop; the lightbox
            shows each photograph whole. */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {images.map((image, i) => (
            <Bloom key={image.src} order={i % 3}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-3/4 w-full overflow-hidden rounded-xl bg-blush-50"
                aria-label={`View photograph: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover object-[50%_28%] transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-wine-deep/0 transition-colors duration-300 group-hover:bg-wine-deep/10"
                />
              </button>
            </Bloom>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photograph viewer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-wine-deep/92 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.25 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 rounded-full p-3 text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M3 3l12 12M15 3L3 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(dir === "next" ? 1 : -1)
                }}
                aria-label={dir === "next" ? "Next photograph" : "Previous photograph"}
                className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory ${
                  dir === "next" ? "right-3 sm:right-6" : "left-3 sm:left-6"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d={dir === "next" ? "M7 3l7 7-7 7" : "M13 3l-7 7 7 7"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}

            <motion.div
              key={index}
              className="relative max-h-[86dvh] w-auto"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[index].src}
                alt={images[index].alt}
                width={images[index].width}
                height={images[index].height}
                sizes="90vw"
                className="max-h-[86dvh] w-auto rounded-lg object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
