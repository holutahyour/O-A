import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { wedding } from "@/data/wedding"
import { longDate } from "@/lib/format"

/**
 * The link preview card.
 *
 * This matters more than almost anything else on the site: the URL will be
 * pasted into WhatsApp hundreds of times, and this image is the first thing
 * most guests will ever see of the day. It is drawn at the correct
 * 1200x630 rather than letting a portrait invitation photo be cropped to
 * ribbons by a chat client.
 *
 * The font is bundled in the repo rather than fetched at build time, so the
 * build never depends on the network. See assets/fonts/OFL.txt for its licence.
 */

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${wedding.couple.first} and ${wedding.couple.second}, ${longDate(
  wedding.ceremonyAt,
)}`

/** A small diamond, drawn rather than typed - the serif has no glyph for it. */
function Diamond() {
  return (
    <div
      style={{
        width: 9,
        height: 9,
        backgroundColor: "#B0629C",
        transform: "rotate(45deg)",
        display: "flex",
      }}
    />
  )
}

export default async function Image() {
  const serif = await readFile(
    join(process.cwd(), "assets", "fonts", "CormorantGaramond-Light.ttf"),
  )

  const names = `${wedding.couple.first} & ${wedding.couple.second}`
  const date = longDate(wedding.ceremonyAt)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFAFD",
          // Satori interpolates `transparent` as transparent *black*, which
          // turns any fade into a grey smudge. Fading to a zero-alpha copy of
          // the same colour keeps the wash pink and lilac.
          backgroundImage:
            "radial-gradient(ellipse 75% 75% at 8% 0%, rgba(241,213,230,0.9) 0%, rgba(241,213,230,0) 70%)," +
            "radial-gradient(ellipse 70% 70% at 95% 100%, rgba(233,218,243,0.95) 0%, rgba(233,218,243,0) 70%)",
          fontFamily: "Cormorant",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1px solid rgba(176,98,156,0.45)",
            borderRadius: 8,
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 21,
            letterSpacing: 7,
            color: "#7D6679",
            display: "flex",
            textTransform: "uppercase",
          }}
        >
          {wedding.occasion}
        </div>

        <div
          style={{
            fontSize: 92,
            color: "#5C2350",
            marginTop: 22,
            display: "flex",
            lineHeight: 1.05,
          }}
        >
          {names}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40 }}>
          <div
            style={{ width: 92, height: 1, backgroundColor: "#B0629C", display: "flex" }}
          />
          <Diamond />
          <div
            style={{ width: 92, height: 1, backgroundColor: "#B0629C", display: "flex" }}
          />
        </div>

        <div
          style={{
            fontSize: 34,
            letterSpacing: 2,
            color: "#33222F",
            marginTop: 36,
            display: "flex",
          }}
        >
          {date}
        </div>

        <div
          style={{
            fontSize: 20,
            letterSpacing: 5,
            color: "#7D6679",
            marginTop: 16,
            display: "flex",
            textTransform: "uppercase",
          }}
        >
          {wedding.locality}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Cormorant", data: serif, style: "normal", weight: 300 }],
    },
  )
}
