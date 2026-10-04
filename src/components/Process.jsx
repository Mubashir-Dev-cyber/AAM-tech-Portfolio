import { process } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import useSectionProgress from '../hooks/useSectionProgress.js'

export default function Process() {
  // The timeline fills as you scroll through the section, and empties on the way back
  const timeline = useSectionProgress()

  return (
    <section className="section section--alt" id="process">
      <div className="container">
        <SectionHeader
          eyebrow="How we work"
          title="A simple, transparent process"
          text="Four clear steps from first conversation to launch — and we stay with you after."
        />
        <div className="process" ref={timeline}>
          <div className="process__line" aria-hidden="true">
            <span className="process__fill" />
          </div>
          <ol className="grid grid--4 process__steps">
            {process.map((p, i) => (
              <Reveal
                as="li"
                className="process__step"
                key={p.step}
                index={i}
                style={{ '--at': (i / (process.length - 1)) * 0.96 }}
              >
                <span className="process__dot" aria-hidden="true" />
                <div className="process__head">
                  <span className="process__num">{p.step}</span>
                  <span className="card__icon process__icon" aria-hidden="true">{p.icon}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
