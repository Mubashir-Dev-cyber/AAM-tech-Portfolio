import { company } from '../data.js'

export default function Footer() {
  // Only pages with a link set in data.js are shown
  const socials = company.socials.filter((s) => s.href)

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        {socials.length > 0 && (
          <ul className="footer__socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
