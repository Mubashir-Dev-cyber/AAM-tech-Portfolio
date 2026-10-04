import { company, values } from '../data.js'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <Reveal>
          <p className="eyebrow">About us</p>
          <h2>Your partner for a stronger online presence</h2>
          <p>
            {company.name} is a technology and software development company. We work
            closely with businesses, startups, and organizations to turn ideas into
            websites and digital products that look great, work flawlessly, and
            deliver real results.
          </p>
          <p>
            Every project is tailored — no cookie-cutter templates. We focus on
            what your customers need so your site becomes a tool that grows your business.
          </p>
          <a href="#contact" className="btn about__cta">Start your project →</a>
        </Reveal>

        <div className="about__grid">
          {values.map((v, i) => (
            <Reveal key={v.title} index={i}>
              <TiltCard className="card value">
                <div className="card__icon" aria-hidden="true">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
