import { company } from '../data.js'
import Reveal from './Reveal.jsx'
import SectionHeader from './SectionHeader.jsx'

// Office map on the Contact page. Hidden until an address or embed link is set in data.js.
export default function LocationMap() {
  const { address, mapEmbed, mapLink } = company
  if (!address && !mapEmbed) return null

  // The "Embed a map" link shows the exact pin; an address alone works without an API key
  const src = mapEmbed || `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const openUrl = mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || company.name)}`

  return (
    <section className="section" id="map">
      <div className="container">
        <SectionHeader eyebrow="Find us" title="Visit our office" text={address || undefined} />
        <Reveal className="card map">
          <iframe
            src={src}
            title={`${company.name} location on Google Maps`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>
        <div className="map__actions">
          <a className="btn btn--ghost" href={openUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
