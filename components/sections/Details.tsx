import { wedding } from "@/data/wedding"
import Bloom from "@/components/motion/Bloom"
import SectionHeading from "@/components/ui/SectionHeading"

function Card({
  title,
  children,
  order,
}: {
  title: string
  children: React.ReactNode
  order: number
}) {
  return (
    <Bloom
      as="article"
      order={order}
      className="rounded-2xl border border-blush-200 bg-ivory p-7"
    >
      <h3 className="font-display text-[22px] font-normal leading-tight text-wine">
        {title}
      </h3>
      <div className="mt-3 text-[14px] leading-relaxed text-ink">{children}</div>
    </Bloom>
  )
}

export default function Details() {
  return (
    <section id="details" className="section bg-blush-50">
      <div className="shell">
        <SectionHeading
          eyebrow="Good to know"
          title="The Details"
          lead="A few small things that will make the day run beautifully for everyone."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <Card title="Colour of the day" order={0}>
            <p>Wear it if you can, and if not, simply come dressed to celebrate.</p>
            <ul className="mt-4 space-y-2.5">
              {wedding.colours.map((c) => (
                <li key={c.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="block h-7 w-12 rounded-md border border-black/5 shadow-inner"
                    style={{ background: c.hex }}
                  />
                  <span className="font-ui text-[13px] font-medium uppercase tracking-[0.14em] text-ink">
                    {c.name}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Adults only" order={1}>
            <p>
              We love your little ones dearly, but children are not allowed at this
              celebration. Thank you for understanding, and for making arrangements ahead of
              the day.
            </p>
          </Card>

          <Card title="Getting there" order={2}>
            <p>
              {wedding.venue.name} is on M.K.O Abiola Gardens Road in Ikeja, beside Adonai
              Court. Give your driver that landmark, or open the map from the section above.
            </p>
          </Card>

          <Card title="Staying over" order={3}>
            <p>
              Travelling in for the day? There are good hotels a short drive from the hall,
              and we have gathered a few for you.
            </p>
            <a
              href="#stay"
              className="mt-3 inline-block py-3 font-ui text-[11px] font-medium uppercase tracking-[0.16em] text-wine underline decoration-gold/50 underline-offset-4 transition-colors hover:decoration-gold"
            >
              See where to stay
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}
