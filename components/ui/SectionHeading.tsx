import Bloom from "@/components/motion/Bloom"
import Ornament from "@/components/motion/Ornament"

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "wine",
  align = "center",
}: {
  eyebrow: string
  title: string
  lead?: string
  tone?: "wine" | "ivory"
  align?: "center" | "left"
}) {
  const centred = align === "center"

  return (
    <Bloom className={centred ? "text-center" : "text-left"}>
      <p className={`eyebrow ${tone === "ivory" ? "text-champagne" : ""}`}>{eyebrow}</p>
      <h2
        className="mt-3 font-display text-[clamp(30px,7vw,52px)] font-normal"
        style={tone === "ivory" ? { color: "var(--color-ivory)" } : undefined}
      >
        {title}
      </h2>
      <Ornament
        width={44}
        tone={tone === "ivory" ? "ivory" : "gold"}
        className={centred ? "mt-5" : "mt-5 justify-start"}
      />
      {lead && (
        <p
          className={`mt-6 text-[16px] leading-relaxed ${
            centred ? "mx-auto max-w-2xl" : "max-w-2xl"
          } ${tone === "ivory" ? "text-champagne/90" : "text-ink"}`}
        >
          {lead}
        </p>
      )}
    </Bloom>
  )
}
