import { useEffect, useMemo, useState } from 'react'
import { FaBars, FaTimes, FaEnvelope } from 'react-icons/fa'
import logoImg from '../assets/logo.png'

export default function Navbar({ lang, onToggleLang, navLabels }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const items = useMemo(
    () => [
      { id: 'about', label: navLabels.about },
      { id: 'skills', label: navLabels.skills },
      { id: 'projects', label: navLabels.projects },
      { id: 'education', label: navLabels.education },
      { id: 'contact', label: navLabels.contact },
    ],
    [navLabels],
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Scroll Spy Logic
      const sections = ['about', 'skills', 'projects', 'education', 'contact']
      const scrollPos = window.scrollY + 160

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i])
          return
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNavClick(e, id) {
    e.preventDefault()
    setOpen(false)
    if (id === 'top' || id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="navbar-inner">
        <a className="brand-wrap" href="#top" onClick={(e) => handleNavClick(e, 'top')}>
          <img className="brand-logo" src={logoImg} alt="EMEKSON logo" />
          <span className="brand-title">EMEKSON<span style={{ color: 'var(--accent)' }}>.</span></span>
        </a>

        <nav
          id="primary-nav"
          className={`nav-links ${open ? 'nav-links-open' : ''}`}
          aria-label="Primary"
        >
          {items.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-controls-group">
          <button
            className="btn-lang"
            onClick={onToggleLang}
            aria-label="Toggle language"
            title="Switch Language"
          >
            {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </button>

          <a 
            href="#contact" 
            className="btn-contact-pill"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            <FaEnvelope style={{ marginRight: '6px' }} />
            {lang === 'en' ? 'Hire Me' : 'Me Recruter'}
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  )
}
