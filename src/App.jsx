import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import About from './components/About.jsx'
import Process from './components/Process.jsx'
import ContactPage from './pages/ContactPage.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Work from './pages/Work.jsx'

// three.js is large — load it in its own chunk so the text renders first
const ScrollScene = lazy(() => import('./components/ScrollScene.jsx'))

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Process />
    </>
  )
}

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
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
