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
  const [form, setForm] = useState({ name: '', email: '', message: '', _gotcha: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()

    // No Formspree form yet: open the visitor's email client with the message pre-filled
    if (!company.formspreeId) {
      const subject = encodeURIComponent(`Project enquiry from ${form.name}`)
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
      window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`
      return
    }

    // Formspree emails the message to us; the visitor's address becomes the reply-to
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${company.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Project enquiry from ${form.name}` }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      setForm({ name: '', email: '', message: '', _gotcha: '' })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
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
              <a className="contact__whatsapp" href={whatsappLink('contact')} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Chat with us
              </a>
            </li>
            <li><span>Location</span>{company.address || company.location}</li>
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
          {/* Hidden from people; bots that fill it in are dropped by Formspree */}
          <input
            type="text"
            name="_gotcha"
            value={form._gotcha}
            onChange={update}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="form__trap"
          />
          <button className="btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className={`form__status form__status--${status}`} role="status" aria-live="polite">
            {status === 'sent' && "Thanks! Your message has been sent — we'll reply within 24 hours."}
            {status === 'error' && (
              <>
                Something went wrong. Please email us at <a href={`mailto:${company.email}`}>{company.email}</a> or
                message us on WhatsApp.
              </>
            )}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
