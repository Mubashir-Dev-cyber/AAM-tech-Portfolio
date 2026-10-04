import { services } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeader
          eyebrow="What we do"
          title="Services built around your goals"
          text="From a simple landing page to a full web application, we handle design, development, and launch."
        />
        <div className="grid grid--3">
          {services.map((s, i) => (
            <Reveal key={s.title} index={i % 3}>
              <TiltCard as="article" className="card">
                <div className="card__icon" aria-hidden="true">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
