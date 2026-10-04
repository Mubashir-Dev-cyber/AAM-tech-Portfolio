import { Link } from 'react-router-dom'
import { company, stats } from '../data.js'
import Reveal from './Reveal.jsx'

// The 3D shapes behind this section live in ScrollScene (rendered from App).
export default function Hero() {
  return (
    <section className="hero" id="top">

      <div className="container hero__inner">
        <p className="eyebrow">Web design & development studio</p>
        <h1 className="hero__title">
          We build <span className="gradient-text gradient-text--animated">digital experiences</span> that grow businesses.
        </h1>
        <p className="hero__intro">{company.intro}</p>
        <div className="hero__actions">
          <Link to="/contact" className="btn">Start your project</Link>
          <Link to="/work" className="btn btn--ghost">See our work</Link>
        </div>

        <ul className="hero__stats">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} index={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
