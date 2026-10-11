import QRCode from "qrcode"
import { wedding } from "@/data/wedding"
import { longDate } from "@/lib/format"
import Bloom from "@/components/motion/Bloom"
import Ornament from "@/components/motion/Ornament"
import SectionHeading from "@/components/ui/SectionHeading"

/**
 * The QR is generated from the maps URL, so it stays sharp at any size and
 * updates automatically if the couple change the pin. It is for the guest
 * reading this on a laptop: point a phone at the screen and the hall opens in
 * Maps.
 */
async function mapQr(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#5C2350", light: "#00000000" },
  })
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-1 shrink-0 text-gold"
    >
      <path
        d="M8 1.75c-2.4 0-4.35 1.9-4.35 4.25 0 3.2 4.35 8.25 4.35 8.25s4.35-5.05 4.35-8.25c0-2.35-1.95-4.25-4.35-4.25Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-1 shrink-0 text-gold"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.6V8l2.4 1.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default async function TheDay() {
  const { venue } = wedding
  const qr = await mapQr(venue.mapsUrl)

  return (
    <section id="the-day" className="section relative">
      <div className="shell max-w-4xl">
        <SectionHeading
          eyebrow={longDate(wedding.ceremonyAt)}
          title="The Day"
          lead="One hall, one afternoon. Everything happens at the same venue in Ikeja, so once you have arrived there is nowhere else to find."
        />

        <Bloom
          as="article"
          order={1}
          className="mt-14 grid overflow-hidden rounded-2xl border border-blush-200 bg-ivory transition-colors hover:border-gold/40 md:grid-cols-[1fr_auto]"
        >
          <div className="flex flex-col p-7 sm:p-9">
            <p className="eyebrow">{venue.label}</p>
            <Ornament width={30} className="mt-4 justify-start" />

            <h3 className="mt-5 font-display text-[clamp(27px,6vw,36px)] font-normal leading-tight text-wine">
              {venue.name}
            </h3>

            <div className="mt-5 flex-1 space-y-3">
              <p className="flex gap-2.5 text-[14px] leading-relaxed text-ink">
                <PinIcon />
                <span>{venue.address}</span>
              </p>
              <p className="flex gap-2.5 text-[14px] leading-relaxed text-ink">
                <ClockIcon />
                <span>{venue.time}</span>
              </p>
            </div>

            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center self-start rounded-full bg-wine px-7 py-3.5 font-ui text-[11px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-wine-deep"
            >
              Open in Maps
            </a>
          </div>

          {/* ── The map code, for the guest reading on a bigger screen ───── */}
          <div className="flex flex-col items-center justify-center gap-4 bg-blush-50 p-8 text-center md:w-64">
            <div
              className="h-[120px] w-[120px] shrink-0 [&_svg]:h-full [&_svg]:w-full"
              // Generated above from a URL we control.
              dangerouslySetInnerHTML={{ __html: qr }}
              role="img"
              aria-label="QR code linking to the venue on Google Maps"
            />
            <div>
              <p className="eyebrow">Map to the hall</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">
                Point a phone camera at this code to open the venue in Maps.
              </p>
            </div>
          </div>
        </Bloom>
      </div>
    </section>
  )
}
