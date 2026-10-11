import { wedding } from "@/data/wedding"
import { longDate } from "@/lib/format"
import Bloom from "@/components/motion/Bloom"
import Ornament from "@/components/motion/Ornament"
import Monogram from "@/components/ui/Monogram"

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-wine-deep py-20 text-ivory">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(199,127,162,0.22) 0%, transparent 70%)",
        }}
      />

      <Bloom className="shell relative text-center">
        <Monogram size={48} tone="ivory" />

        <p className="mt-8 font-display text-[clamp(24px,6vw,38px)] font-light leading-tight text-ivory">
          {wedding.couple.first}
          <span
            className="ml-2 mr-5 font-script text-[1.3em] text-champagne"
            aria-hidden="true"
          >
            &amp;
          </span>
          <span className="sr-only">and </span>
          {wedding.couple.second}
        </p>

        <p className="eyebrow mt-3 text-champagne/80">{longDate(wedding.ceremonyAt)}</p>

        <Ornament width={44} tone="ivory" className="mt-7" />

        {wedding.couple.hashtag && (
          <p className="eyebrow mt-7 text-champagne">{wedding.couple.hashtag}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {wedding.rsvpPhones.map((p) => (
            <a
              key={p.tel}
              href={`tel:${p.tel}`}
              className="tabular inline-block py-2.5 font-ui text-[14px] text-ivory/80 underline decoration-champagne/40 underline-offset-4 transition-colors hover:text-ivory hover:decoration-champagne"
            >
              {p.name} · {p.display}
            </a>
          ))}
        </div>

        <p className="mt-14 text-[13px] leading-relaxed text-ivory/50">
          Made with love, for a day we have all been waiting for.
        </p>
      </Bloom>
    </footer>
  )
}
