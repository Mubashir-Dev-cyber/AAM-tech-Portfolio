import Reveal from './Reveal.jsx'

export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <Reveal className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-header__text">{text}</p>}
    </Reveal>
  )
}
