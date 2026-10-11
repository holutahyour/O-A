import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"

/**
 * The story is the couple's own, word for word, so it is set as a letter
 * rather than chopped into a timeline: an opening line in display type, the
 * rest as prose, and their last sentence left to stand alone.
 */
export default function Story() {
  const [opening, ...rest] = wedding.story.paragraphs

  return (
    <section id="story" className="section wash relative">
      <div className="shell max-w-2xl">
        <SectionHeading eyebrow="How we got here" title="Our Story" />

        <Bloom order={1}>
          <p className="mt-14 text-center font-display text-[clamp(21px,5vw,27px)] font-light leading-snug text-wine">
            {opening}
          </p>
        </Bloom>

        <div className="mt-8 space-y-6 text-center">
          {rest.map((paragraph, i) => (
            <Bloom key={paragraph} order={i % 3}>
              <p className="text-[16px] leading-relaxed text-ink">{paragraph}</p>
            </Bloom>
          ))}
        </div>

        <Bloom order={1}>
          <span aria-hidden="true" className="mx-auto mt-12 block h-10 w-px bg-gold/50" />
          <p className="mt-8 text-center font-display text-[clamp(24px,6vw,34px)] font-light italic leading-snug text-wine">
            {wedding.story.closing}
          </p>
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="mx-auto mt-5 text-blush-400"
          >
            <path
              d="M12 20.5S3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6.2a4.9 4.9 0 0 1 8.5 3.2c0 5.8-8.5 11.1-8.5 11.1Z"
              fill="currentColor"
            />
          </svg>
          <p className="eyebrow mt-5 text-center">
            {wedding.couple.first} &amp; {wedding.couple.second}
          </p>
        </Bloom>
      </div>
    </section>
  )
}
