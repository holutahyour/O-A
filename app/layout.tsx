import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Gilda_Display, Italianno, Jost } from "next/font/google"
import { wedding } from "@/data/wedding"
import { longDate } from "@/lib/format"
import { GiftSheetProvider } from "@/components/gift/GiftSheet"
import Bokeh from "@/components/motion/Bokeh"
import Header from "@/components/sections/Header"
import "./globals.css"

/* Display and headings. Gilda Display ships as a single upright weight. */
const gilda = Gilda_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gilda",
  display: "swap",
})

/* Gilda has no italic, and a browser-slanted one looks cheap. The few italic
   passages (the scripture, the story's last line) borrow Cormorant's. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
})

/* One script, used for a handful of words on the whole site. */
const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
})

/* Everything functional: buttons, labels, forms, eyebrows. */
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
})

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

const TITLE = `${wedding.couple.first} & ${wedding.couple.second} · ${longDate(
  wedding.ceremonyAt,
).replace(/^[A-Za-z]+,\s*/, "")}`

const DESCRIPTION =
  `You are invited to the ${wedding.occasion.toLowerCase()} of ${wedding.couple.first} and ` +
  `${wedding.couple.second} in ${wedding.locality}. RSVP, find your way to the hall, and see where to stay.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: TITLE,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#FFFAFD",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${gilda.variable} ${cormorant.variable} ${italianno.variable} ${jost.variable}`}
    >
      <body>
        <Bokeh />
        <GiftSheetProvider>
          <Header />
          {children}
        </GiftSheetProvider>
      </body>
    </html>
  )
}
