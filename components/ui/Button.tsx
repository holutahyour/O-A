import type { ComponentPropsWithoutRef, ReactNode } from "react"

type Variant = "primary" | "outline" | "ghost" | "light"
type Size = "md" | "lg"

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-wine text-ivory hover:bg-wine-deep shadow-[0_6px_20px_-8px_rgba(92,35,80,0.55)]",
  outline:
    "border border-gold/60 text-wine hover:border-gold hover:bg-champagne/25",
  ghost: "text-wine hover:bg-blush-50",
  light:
    "bg-ivory/10 text-ivory border border-ivory/25 hover:bg-ivory/20 backdrop-blur-sm",
}

const SIZES: Record<Size, string> = {
  md: "px-6 py-3 text-[12px]",
  lg: "px-8 py-4 text-[13px]",
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-ui font-medium uppercase tracking-[0.16em] " +
  "transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 " +
  "disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-center"

function classes(variant: Variant, size: Size, extra?: string) {
  return [BASE, VARIANTS[variant], SIZES[size], extra].filter(Boolean).join(" ")
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}

type LinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <a className={classes(variant, size, className)} {...rest}>
      {children}
    </a>
  )
}
