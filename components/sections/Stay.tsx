import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"

/**
 * For guests travelling in. Each card hands off to Google Maps rather than
 * quoting a rate or a phone number - those change, and a wrong one is worse
 * than none. An empty list hides the section.
 */
export default function Stay() {
  if (wedding.hotels.length === 0) return null

  return (
    <section id="stay" className="section wash relative">
      <div className="shell">
        <SectionHeading
          eyebrow="Coming from out of town"
          title="Where to Stay"
          lead="A few hotels in Ikeja, all a short drive from the hall, nearest first. Rooms fill quickly in December, so it is worth booking early."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wedding.hotels.map((hotel, i) => (
            <Bloom
              as="article"
              key={hotel.id}
              order={i % 3}
              className="flex h-full flex-col rounded-2xl border border-blush-200 bg-ivory p-7 transition-colors hover:border-gold/40"
            >
              <p className="eyebrow">{hotel.area}</p>
              <h3 className="mt-3 font-display text-[23px] font-normal leading-tight text-wine">
                {hotel.name}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink">{hotel.note}</p>
              <a
                href={hotel.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Find ${hotel.name} on the map`}
                className="mt-6 inline-flex items-center justify-center rounded-full border border-gold/50 px-6 py-3 font-ui text-[11px] font-medium uppercase tracking-[0.16em] text-wine transition-colors hover:border-gold hover:bg-champagne/30"
              >
                Find on the map
              </a>
            </Bloom>
          ))}
        </div>
      </div>
    </section>
  )
}
