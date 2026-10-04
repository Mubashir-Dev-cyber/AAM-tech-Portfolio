import { useState } from 'react'
import { company, whatsappLink } from '../data.js'
import Reveal from './Reveal.jsx'
import { WhatsAppIcon } from './WhatsAppButton.jsx'

const nextSteps = [
  { title: 'We reply within 24 hours', text: 'A real person reads every message and gets back to you.' },
  { title: 'A free discovery call', text: 'We talk through your goals, audience and must-haves.' },
  { title: 'Proposal & quote', text: 'A clear plan, timeline and fixed price — no surprises.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Opens the visitor's email client with the message pre-filled.
  // Swap this for a form service (e.g. Formspree) or your own API if you prefer.
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`
  }

  return (
    <section className="section" id="contact">
      <div className="container contact">
        <Reveal>
          <h2>What happens next</h2>
          <ol className="contact__steps">
            {nextSteps.map((s, i) => (
              <li key={s.title}>
                <span className="contact__step-num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="contact__info">
            <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li>
              <span>WhatsApp</span>
              <a className="contact__whatsapp" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Chat with us
              </a>
            </li>
            <li><span>Location</span>{company.location}</li>
          </ul>
        </Reveal>

        <Reveal as="form" className="form" index={1} onSubmit={submit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={update} required placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com" />
          </label>
          <label>
            Project details
            <textarea name="message" rows="5" value={form.message} onChange={update} required placeholder="What would you like to build?" />
          </label>
          <button className="btn" type="submit">Send message</button>
        </Reveal>
      </div>
    </section>
  )
}
