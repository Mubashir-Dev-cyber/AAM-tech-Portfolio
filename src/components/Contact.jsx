import { useState } from 'react'
import { company } from '../data.js'
import Reveal from './Reveal.jsx'

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
          <p className="eyebrow">Contact</p>
          <h2>Let's build something great together</h2>
          <p>
            Tell us about your project and we'll get back to you with ideas,
            a timeline, and a quote.
          </p>
          <ul className="contact__info">
            <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
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
