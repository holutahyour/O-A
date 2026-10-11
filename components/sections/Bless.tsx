import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"
import GiftCta from "@/components/gift/GiftCta"

/**
 * No gift list and no funds - one quiet invitation to bless the couple, and
 * one button that opens the account details.
 */
export default function Bless() {
  return (
    <section id="bless" className="section relative">
      <div className="shell max-w-3xl">
        <SectionHeading
          eyebrow="With love"
          title="Bless the Couple"
          lead={`Your presence is the gift. But if it is on your heart to bless ${wedding.couple.first} and ${wedding.couple.second} as they begin, you can send it straight to them here.`}
        />

        <Bloom order={1} className="mt-9 flex justify-center">
          <GiftCta />
        </Bloom>
      </div>
    </section>
  )
}
