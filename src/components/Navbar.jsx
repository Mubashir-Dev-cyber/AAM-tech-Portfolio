import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { company } from '../data.js'
import useTheme from '../hooks/useTheme.js'
import ThemeToggle from './ThemeToggle.jsx'

// Section links point at the home page, so they work from any page
const links = [
  { to: '/#services', label: 'Services' },
  { to: '/#about', label: 'About' },
  { to: '/#process', label: 'Process' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" onClick={() => setOpen(false)}>
          <span className="nav__mark">A</span>
          {company.name}
        </Link>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <NavLink
            to="/work"
            className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            onClick={() => setOpen(false)}
          >
            Work
          </NavLink>
          <ThemeToggle value={theme} onChange={setTheme} />
          <NavLink to="/contact" className="btn btn--small nav__cta--menu" onClick={() => setOpen(false)}>
            Contact Us
          </NavLink>
        </nav>
        <NavLink to="/contact" className="btn btn--small nav__cta--bar">Contact Us</NavLink>
      </div>
    </header>
  )
}
