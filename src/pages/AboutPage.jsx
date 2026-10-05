import { Link } from 'react-router-dom'
import { about, company, team } from '../data.js'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import TiltCard from '../components/TiltCard.jsx'

// Files in /public live under the site's base path ('/AAM-tech-Portfolio/' on GitHub Pages)
const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')

// "Jane Doe" -> "JD"
const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export default function AboutPage() {
  return (
    <>
      <section className="hero page-head" id="top">
        <div className="container hero__inner">
          <p className="eyebrow">About us</p>
          <h1 className="hero__title">
            The people behind <span className="gradient-text">{company.name}</span>.
          </h1>
          <p className="hero__intro">
            A small, focused team building websites and web apps that help businesses grow.
          </p>
        </div>
      </section>

      <section className="section" id="team">
        <div className="container">
          <SectionHeader
            eyebrow="Our team"
            title="Meet the team"
            text="The people you'll work with, from the first call to launch day."
          />
          <div className="team__grid">
            {team.map((m, i) => (
              <Reveal key={`${m.name}-${i}`} index={i}>
                <TiltCard className="card team__card">
                  {m.photo ? (
                    <img className="team__avatar team__avatar--photo" src={asset(m.photo)} alt={m.name} />
                  ) : (
                    <div className="team__avatar" aria-hidden="true">{initials(m.name)}</div>
                  )}
                  <h3>{m.name}</h3>
                  {m.role && <p className="team__role">{m.role}</p>}
                  {m.bio && <p>{m.bio}</p>}
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="story">
        <div className="container about">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2>Built for businesses that want more from the web</h2>
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal index={1}>
            <div className="card about__mission">
              <p className="eyebrow">Our mission</p>
              <p className="about__mission-text">{about.mission}</p>
              <ul className="hero__stats about__highlights">
                {about.highlights.map((h) => (
                  <li key={h.label}>
                    <strong>{h.value}</strong>
                    <span>{h.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="container">
          <Reveal className="about__closing">
            <h2>Let's build something together</h2>
            <div className="hero__actions">
              <Link to="/contact" className="btn">Start your project</Link>
              <Link to="/work" className="btn btn--ghost">See our work</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
