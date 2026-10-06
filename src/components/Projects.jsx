import { projects } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

export default function Projects() {
  return (
    <section className="section section--alt" id="work">
      <div className="container">
        <SectionHeader
          eyebrow="Selected work"
          title="Projects we're proud of"
          text="A look at the kinds of websites and apps we design and build."
        />
        <div className="grid grid--2">
          {projects.map((p, i) => (
            <Reveal key={p.title} index={i % 2}>
              <TiltCard as="article" className="project" max={6}>
                <div className="project__thumb" style={{ background: p.gradient }}>
                  <div className="project__browser">
                    <span /><span /><span />
                  </div>
                  <span className="project__thumb-title">{p.title}</span>
                </div>
                <div className="project__body">
                  <p className="project__category">{p.category}</p>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <ul className="tags">
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  {/^https?:\/\//.test(p.link) && (
                    <a href={p.link} className="project__link" target="_blank" rel="noopener noreferrer">
                      View project →
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
