import Contact from '../components/Contact.jsx'
import LocationMap from '../components/LocationMap.jsx'

export default function ContactPage() {
  return (
    <>
      <section className="hero page-head" id="top">
        <div className="container hero__inner">
          <p className="eyebrow">Contact</p>
          <h1 className="hero__title">
            Let's build something <span className="gradient-text">great</span> together.
          </h1>
          <p className="hero__intro">
            Tell us about your project and we'll get back to you with ideas, a timeline, and a quote.
          </p>
        </div>
      </section>
      <Contact />
      <LocationMap />
    </>
  )
}
