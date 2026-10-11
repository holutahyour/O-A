import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"

/**
 * Built on <details>/<summary>: keyboard accessible, screen-reader friendly,
 * and works with JavaScript switched off. No accordion library required.
 */
export default function Faq() {
  return (
    <section id="faq" className="section relative">
      <div className="shell max-w-3xl">
        <SectionHeading eyebrow="In case you were wondering" title="Questions" />

        <div className="mt-14 divide-y divide-blush-200 border-y border-blush-200">
          {wedding.faq.map((item, i) => (
            <Bloom key={item.q} order={i % 3}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-[19px] leading-snug text-wine transition-colors hover:text-wine-deep [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
                  >
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </summary>
                <p className="pb-6 pr-8 text-[15px] leading-relaxed text-ink">{item.a}</p>
              </details>
            </Bloom>
          ))}
        </div>
      </div>
    </section>
  )
}
