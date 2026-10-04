// All site content lives here — edit this file to update the portfolio.

export const company = {
  name: 'AAM tech',
  tagline: 'We build digital experiences that grow businesses.',
  intro:
    'AAM tech is a technology and software development company helping businesses, startups, and organizations build a strong digital presence with modern, responsive, and user-friendly websites.',
  email: 'am.pk.tech@gmail.com',
  // Contact form delivery. Until this is set, "Send message" opens the visitor's email app instead.
  formspreeId: '', // TODO: paste your Formspree form ID (the part after formspree.io/f/)
  // Country code + number, digits only (no +, spaces or leading 0)
  whatsapp: '923001234567', // TODO: replace with your real WhatsApp number
  whatsappMessage: "Hi AAM tech, I'd like to discuss a project.",
  location: 'Remote — working with clients worldwide',
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
}

// Opens a WhatsApp chat with the greeting pre-filled (app on phones, WhatsApp Web on desktop)
export const whatsappLink = () =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(company.whatsappMessage)}`

export const stats = [
  { value: '100%', label: 'Responsive builds' },
  { value: '24h', label: 'Response time' },
  { value: 'End-to-end', label: 'Design to launch' },
]

export const services = [
  {
    icon: '◧',
    title: 'Website Design',
    text: 'Clean, modern interfaces designed around your brand and your customers — beautiful on every screen size.',
  },
  {
    icon: '⌘',
    title: 'Web Development',
    text: 'Fast, accessible, SEO-friendly websites built with modern tools like React, so they load quickly and rank well.',
  },
  {
    icon: '◎',
    title: 'E-commerce',
    text: 'Online stores with smooth checkout, product management, and payment integration that turn visitors into buyers.',
  },
  {
    icon: '⟳',
    title: 'Redesign & Maintenance',
    text: 'Give an outdated site a fresh look, improve performance, and keep everything secure and up to date.',
  },
  {
    icon: '▤',
    title: 'Custom Web Apps',
    text: 'Dashboards, booking systems, and internal tools tailored to the way your business actually works.',
  },
  {
    icon: '↗',
    title: 'SEO & Performance',
    text: 'Technical SEO, Core Web Vitals tuning, and analytics setup so you can measure and grow your traffic.',
  },
]

// TODO: replace these sample projects with your real work.
export const projects = [
  {
    title: 'Bloom Café',
    category: 'Restaurant website',
    text: 'A warm, mobile-first site with an online menu, table booking, and Google Maps integration.',
    tags: ['React', 'Responsive', 'SEO'],
    gradient: 'linear-gradient(135deg, #ff9a8b, #ff6a88)',
    link: '#',
  },
  {
    title: 'Nova Store',
    category: 'E-commerce',
    text: 'A fast online storefront with product filtering, cart, and secure checkout.',
    tags: ['E-commerce', 'Payments', 'Performance'],
    gradient: 'linear-gradient(135deg, #6d5dfc, #36c2f6)',
    link: '#',
  },
  {
    title: 'Peak Fitness',
    category: 'Business landing page',
    text: 'A high-converting landing page with class schedules and membership sign-up.',
    tags: ['Landing page', 'Animations', 'Forms'],
    gradient: 'linear-gradient(135deg, #34d399, #0ea5e9)',
    link: '#',
  },
  {
    title: 'Clarity Dashboard',
    category: 'Web application',
    text: 'An internal analytics dashboard that turns raw business data into clear charts.',
    tags: ['Web app', 'Charts', 'Dashboard'],
    gradient: 'linear-gradient(135deg, #f7b733, #fc4a1a)',
    link: '#',
  },
]

export const process = [
  { step: '01', icon: '◎', title: 'Discover', text: 'We learn about your business, goals, audience, and what success looks like.' },
  { step: '02', icon: '◧', title: 'Design', text: 'We create the layout and visual style, and refine it with your feedback.' },
  { step: '03', icon: '⌘', title: 'Develop', text: 'We build a fast, responsive, accessible site with clean, maintainable code.' },
  { step: '04', icon: '↗', title: 'Launch & Support', text: 'We deploy, test across devices, and stay on hand for updates and growth.' },
]

// About page. TODO: rewrite the story and mission in your own words.
export const about = {
  story: [
    'AAM tech started with a simple idea: every business deserves a website that works as hard as they do. Too many small companies were stuck with slow, outdated sites — or no site at all.',
    'Today we design and build websites and web apps for businesses, startups, and organizations around the world. We keep things personal: you talk directly to the people building your project, from the first call to launch day and beyond.',
  ],
  mission:
    'To give every client a fast, beautiful, and easy-to-manage online presence that brings in real customers — with honest pricing and no technical headaches.',
  highlights: [
    { value: 'Worldwide', label: 'Remote clients' },
    { value: '24h', label: 'Reply time' },
    { value: '100%', label: 'Custom builds' },
  ],
}

// Photos live in the `public` folder. `role` and `bio` are optional and only shown when set.
export const team = [
  // TODO: rewrite these placeholder descriptions in your own words
  {
    name: 'Muhammad Mubashir',
    photo: '/mubashir.webp',
    bio: 'Part of the AAM tech team, turning client ideas into fast, polished websites and caring about every detail from the first sketch to launch day.',
  },
  {
    name: 'Abdal Niazi',
    photo: '/abdal.webp',
    bio: 'Part of the AAM tech team, focused on building reliable, well-crafted web experiences for clients around the world.',
  },
]

export const values = [
  { icon: '▣', title: 'Mobile-first', text: 'Responsive design that looks sharp on every phone, tablet, and desktop.' },
  { icon: '{ }', title: 'Clean code', text: 'Well-structured, maintainable code that is easy to grow later.' },
  { icon: '◈', title: 'Transparent pricing', text: 'Clear quotes and timelines up front — no surprises.' },
  { icon: '⟳', title: 'Ongoing support', text: 'We stay on hand after launch for updates and improvements.' },
]
