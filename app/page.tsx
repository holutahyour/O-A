import Hero from "@/components/sections/Hero"
import Countdown from "@/components/sections/Countdown"
import Invitation from "@/components/sections/Invitation"
import Story from "@/components/sections/Story"
import TheDay from "@/components/sections/TheDay"
import Details from "@/components/sections/Details"
import Headwear from "@/components/sections/Headwear"
import Gallery from "@/components/sections/Gallery"
import Stay from "@/components/sections/Stay"
import Bless from "@/components/sections/Bless"
import Rsvp from "@/components/sections/Rsvp"
import Faq from "@/components/sections/Faq"
import Footer from "@/components/sections/Footer"

export default function Page() {
  return (
    <main>
      <Hero />
      <Countdown />
      <Invitation />
      <Story />
      <TheDay />
      <Details />
      <Headwear />
      <Gallery />
      <Stay />
      <Bless />
      <Rsvp />
      <Faq />
      <Footer />
    </main>
  )
}
