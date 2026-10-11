/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything the website says lives here. Change a phone number, add a hotel,
 *  reword an answer - all of it happens in this file. You should never need to
 *  open a component.
 *
 *  Anything marked TODO still needs real information from the couple.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Photo = {
  src: string
  alt: string
}

export type GalleryImage = Photo & {
  /**
   * Real pixel dimensions, so the lightbox can reserve the right space and
   * avoid a layout shift. `pnpm images` prints them for every gallery file.
   */
  width: number
  height: number
}

export type Hotel = {
  id: string
  name: string
  /** The part of Ikeja it sits in, as a guest would say it to a driver. */
  area: string
  note: string
  mapsUrl: string
}

export type Headwear = {
  id: string
  name: string
  note: string
  /** In naira. */
  price: number
}

export type Faq = { q: string; a: string }

export type InternationalAccount = {
  accountName: string
  bank: string
  currency: string
  accountNumber?: string
  sortCode?: string
  iban?: string
  swift?: string
}

export const wedding = {
  /* ── The couple ─────────────────────────────────────────────────────────── */
  couple: {
    // In the order they are printed on the invitation card: Oluwabunmi is the
    // bride, Anuoluwapo the groom.
    first: "Oluwabunmi",
    second: "Anuoluwapo",
    /** The names in full, exactly as printed on the card. */
    firstFull: "Oluwabunmi Adedayo",
    secondFull: "Anuoluwapo Akintoye",
    monogram: "OA",
    /** Written as the couple gave it. Null hides it everywhere. */
    hashtag: "#ForeverwiththeEni’s 2026" as string | null,
  },

  /** What the families are inviting guests to, as printed on the card. */
  occasion: "Engagement Ceremony",

  /**
   * The ceremony as a fixed instant in time.
   * 5 December 2026, 12:00 noon in Lagos. Lagos is UTC+1 all year round
   * (West Africa Time, no daylight saving), so noon local is 11:00 UTC.
   * Stored as UTC so the countdown is correct from any timezone on earth.
   */
  ceremonyAt: "2026-12-05T11:00:00.000Z",

  /* ── The families, exactly as printed on the invitation ─────────────────── */
  families: [
    "Late Abiodun and Mrs Adeyemi Afeniforo",
    "Late Deacon Olufemi and Mrs Titilayo Enilolobo",
  ],

  /* ── Where ──────────────────────────────────────────────────────────────── */
  /** Short form, for the hero and the link preview. */
  locality: "Ikeja, Lagos",

  venue: {
    label: "The Venue",
    name: "Luxury Party Event Centre",
    address: "Block G, Plot A2, M.K.O Abiola Gardens Road, beside Adonai Court, Ikeja, Lagos",
    time: "12 Noon",
    // TODO(couple): replace with the exact Google Maps pin for the hall.
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Luxury+Party+Event+Centre%2C+M.K.O+Abiola+Gardens+Road%2C+Ikeja%2C+Lagos",
  },

  /* ── Reaching the hosts ─────────────────────────────────────────────────── */
  rsvpPhones: [
    { name: "Timilehin", display: "+234 809 437 7809", tel: "+2348094377809" },
    { name: "Moni", display: "+234 816 462 9996", tel: "+2348164629996" },
  ],

  /**
   * The primary line: invitation requests and gele and fila requests are sent
   * here on WhatsApp. Digits only, country code first and no plus sign,
   * exactly as wa.me expects.
   */
  // TODO(couple): confirm this number is on WhatsApp.
  whatsapp: {
    number: "2348094377809",
    display: "+234 809 437 7809",
  },

  /* ── Colour of the day, straight off the card ───────────────────────────── */
  colours: [{ name: "Onion Pink", hex: "#C77FA2" }],

  /* ── Gele and fila ──────────────────────────────────────────────────────── */
  // Guests pick how many they want and the request goes to the primary line
  // above on WhatsApp. Prices are in naira. An empty list hides the section.
  headwear: [
    { id: "gele", name: "Gele", note: "The head tie, for the ladies.", price: 15000 },
    { id: "fila", name: "Fila", note: "The cap, for the gentlemen.", price: 5000 },
  ] as Headwear[],

  /* ── Bless the couple ───────────────────────────────────────────────────── */
  // The bride's own account. While any of the three is empty the sheet shows a
  // "details coming soon" notice with the RSVP numbers, never a half-filled
  // account block.
  bank: {
    accountName: "Simm - Afeni Oluwabunmi Adedayo",
    bankName: "United Bank For Africa",
    accountNumber: "6202202787",

    /**
     * The bride's line. "I have sent my gift" opens a WhatsApp chat with it,
     * and it is the number guests are told to call to confirm the account.
     */
    // TODO(couple): confirm this number is on WhatsApp.
    contact: {
      number: "2348070593932",
      display: "+234 807 059 3932",
      tel: "+2348070593932",
    },

    /**
     * Optional second account for guests sending from abroad.
     * Leave as null and the whole block is hidden - it is never half-rendered.
     */
    international: null as InternationalAccount | null,
  },

  /* ── Their story, in their own words ────────────────────────────────────── */
  story: {
    paragraphs: [
      "What began as a simple meeting soon grew into a beautiful friendship. We got to know each other, shared conversations, laughed together, and slowly discovered how special our connection was.",
      "Looking back, we can see how beautifully God was writing our story all along. What started with two people meeting in church has led us to this beautiful moment.",
      "And now, with grateful hearts and so much joy, we’re getting married!",
      "We can’t wait to begin this next chapter together and see all that God has in store for us.",
    ],
    /** The last line, set apart as the story's closing flourish. */
    closing: "Our friendship became love, and now we’re choosing forever.",
  },

  /* ── Photographs ────────────────────────────────────────────────────────── */
  // The photographs have not arrived yet, and the site is built not to show it:
  // with `portrait` null the hero arch holds a bouquet that blooms around the
  // date, and an empty `gallery` hides that section entirely.
  //
  // When they arrive: drop the originals in images/, list them in
  // scripts/prepare-images.cjs, run `pnpm images`, then fill these in.
  portrait: null as Photo | null,
  gallery: [] as GalleryImage[],

  /* ── Where to stay ──────────────────────────────────────────────────────── */
  // Hotels in Ikeja, nearest the hall first. No prices or phone numbers on
  // purpose - they go stale; each card links to the hotel on Google Maps.
  // TODO(couple): confirm this list, and say here if rooms have been reserved
  // or a group rate agreed anywhere.
  hotels: [
    {
      id: "protea-select",
      name: "Protea Hotel by Marriott Ikeja Select",
      area: "Alausa, Ikeja",
      note: "The closest to the hall, in the same Alausa neighbourhood.",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Protea+Hotel+by+Marriott+Ikeja+Select%2C+Alausa%2C+Ikeja%2C+Lagos",
    },
    {
      id: "radisson-ikeja",
      name: "Radisson Hotel Lagos Ikeja",
      area: "Isaac John Street, Ikeja GRA",
      note: "On the GRA's restaurant strip, with plenty to do the evening before.",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Radisson+Hotel+Lagos+Ikeja%2C+Isaac+John+Street%2C+Ikeja+GRA",
    },
    {
      id: "marriott-ikeja",
      name: "Lagos Marriott Hotel Ikeja",
      area: "Joel Ogunnaike Street, Ikeja GRA",
      note: "A full-service stay in the quiet of the GRA.",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Lagos+Marriott+Hotel+Ikeja%2C+Joel+Ogunnaike+Street%2C+Ikeja+GRA",
    },
    {
      id: "sheraton-lagos",
      name: "Sheraton Lagos Hotel",
      area: "Mobolaji Bank Anthony Way, Ikeja",
      note: "A long-standing Ikeja landmark, handy for guests flying in.",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Sheraton+Lagos+Hotel%2C+Mobolaji+Bank+Anthony+Way%2C+Ikeja",
    },
    {
      id: "ibis-ikeja",
      name: "ibis Lagos Ikeja",
      area: "Toyin Street, Ikeja",
      note: "Simple, comfortable rooms at a gentler price.",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=ibis+Lagos+Ikeja%2C+Toyin+Street%2C+Ikeja",
    },
    {
      id: "lagos-airport-hotel",
      name: "Lagos Airport Hotel",
      area: "Obafemi Awolowo Way, Ikeja",
      note: "Spacious grounds on Ikeja's main road.",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Lagos+Airport+Hotel%2C+Obafemi+Awolowo+Way%2C+Ikeja",
    },
  ] as Hotel[],

  /* ── Questions guests actually ask ──────────────────────────────────────── */
  faq: [
    {
      q: "Can I bring my children?",
      a: "We love your little ones dearly, but children are not allowed at this celebration. Thank you for understanding, and for making arrangements ahead of the day.",
    },
    {
      q: "What should I wear?",
      a: "The colour of the day is onion pink. Wear it if you can, and if not, simply come dressed for a joyful celebration.",
    },
    {
      q: "Where is the venue?",
      a: "Luxury Party Event Centre is on M.K.O Abiola Gardens Road in Ikeja, beside Adonai Court. There is a map link and a scannable code in the section above.",
    },
    {
      q: "I am coming from out of town. Where can I stay?",
      a: "There are several good hotels in Ikeja, a short drive from the hall. We have listed a few on this page, each with a link to find it on the map.",
    },
    {
      q: "Can I bring a plus one?",
      a: "Our seating is planned around named guests. If you would like to bring someone, please call one of the RSVP numbers first so we can make room properly.",
    },
    {
      q: "When should I RSVP by?",
      a: "As early as you can. It helps us plan seating and catering, and we would rather hear from you sooner than perfectly.",
    },
  ] as Faq[],

  /* ── Scripture, used sparingly ──────────────────────────────────────────── */
  scripture: {
    text: "Therefore what God has joined together, let no one separate.",
    ref: "Matthew 19:6",
  },
}

export type Wedding = typeof wedding

/** True once the couple have filled in real bank details. */
export const hasBankDetails = Boolean(
  wedding.bank.accountName && wedding.bank.bankName && wedding.bank.accountNumber,
)
