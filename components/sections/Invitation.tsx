import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import Ornament from "@/components/motion/Ornament"

/**
 * The centrepiece, worded as the printed card is: an engagement is the
 * families' invitation, so the families open it and the couple's names follow
 * in full.
 */
export default function Invitation() {
  return (
    <section id="invitation" className="section relative">
      <div className="shell max-w-3xl text-center">
        <Bloom>
          <Ornament width={46} />
          <p className="eyebrow mt-8">The families of</p>
          <p className="mt-4 font-display text-[clamp(19px,4.6vw,25px)] font-light leading-snug text-wine">
            {wedding.families[0]}
            <span className="my-1 block font-ui text-[12px] text-muted">and</span>
            {wedding.families[1]}
          </p>
          <p className="mt-7 text-[15px] leading-relaxed text-ink">
            cordially invite you to the
          </p>
          <p className="mt-4 font-display text-[clamp(32px,8vw,58px)] font-light leading-none text-wine">
            {wedding.occasion}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink">of their children</p>
        </Bloom>

        <Bloom order={1}>
          <p className="mt-6 font-display text-[clamp(26px,6.5vw,44px)] font-light leading-tight text-wine">
            {wedding.couple.firstFull}
            {/* On its own line: two full names and an ampersand do not fit
                across a phone, and the card stacks them the same way. */}
            <span
              className="block font-script text-[1.3em] leading-[0.9] text-gold"
              aria-hidden="true"
            >
              &amp;
            </span>
            <span className="sr-only"> and </span>
            {wedding.couple.secondFull}
          </p>
        </Bloom>

        <Bloom order={2}>
          <Ornament width={40} className="mt-10" />
          <blockquote className="mt-7">
            <p className="mx-auto max-w-md font-display text-[17px] italic leading-relaxed text-muted">
              “{wedding.scripture.text}”
            </p>
            <cite className="eyebrow mt-4 block not-italic">{wedding.scripture.ref}</cite>
          </blockquote>
        </Bloom>
      </div>
    </section>
  )
}
