import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Projects from './components/Projects.jsx'
import About from './components/About.jsx'
import Process from './components/Process.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

// three.js is large — load it in its own chunk so the text renders first
const ScrollScene = lazy(() => import('./components/ScrollScene.jsx'))

export default function App() {
  return (
    <>
      {/* Glow sits under the 3D canvas, which sits under the page content */}
      <div className="page-glow" aria-hidden="true">
        <div className="hero__glow" />
      </div>
      <Suspense fallback={null}>
        <ScrollScene />
      </Suspense>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
