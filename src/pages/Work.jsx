import { Link } from 'react-router-dom'
import Projects from '../components/Projects.jsx'

export default function Work() {
  return (
    <>
      <section className="hero page-head" id="top">
        <div className="container hero__inner">
          <p className="eyebrow">Our portfolio</p>
          <h1 className="hero__title">
            Work that <span className="gradient-text">speaks for itself</span>.
          </h1>
          <p className="hero__intro">
            A selection of websites and apps we have designed and built for our clients.
          </p>
          <div className="hero__actions">
            <Link to="/contact" className="btn">Start your project</Link>
            <Link to="/" className="btn btn--ghost">Back to home</Link>
          </div>
        </div>
      </section>
      <Projects />
    </>
  )
}
