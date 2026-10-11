import { wedding } from "@/data/wedding"
import Ornament from "@/components/motion/Ornament"

/**
 * The couple's monogram. Appears exactly twice on the page (hero and footer), plus
 * small in the sticky header. Anything more and it stops being a mark.
 */
export default function Monogram({
  size = 64,
  tone = "wine",
  className = "",
}: {
  size?: number
  tone?: "wine" | "ivory"
  className?: string
}) {
  const colour = tone === "wine" ? "var(--color-wine)" : "var(--color-ivory)"

  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      aria-label={`${wedding.couple.first} and ${wedding.couple.second}`}
    >
      <span
        className="font-display"
        style={{
          color: colour,
          fontSize: size,
          letterSpacing: "0.04em",
          fontWeight: 300,
        }}
      >
        {wedding.couple.monogram}
      </span>
      <Ornament width={size * 0.5} tone={tone === "wine" ? "gold" : "ivory"} className="mt-1" />
    </span>
  )
}
