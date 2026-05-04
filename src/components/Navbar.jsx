import { useEffect, useMemo, useState } from 'react'
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'

import logoImg from '../assets/logo.png'

export default function Navbar({ profile, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)

  const items = useMemo(
    () => [
      { id: 'about', label: 'About' },
      { id: 'skills', label: 'Skills' },
      { id: 'projects', label: 'Projects' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact' },
    ],
    [],
  )

  function handleNavClick(e, id) {
    e.preventDefault()
    setOpen(false)
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

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.classList.toggle('nav-drawer-open', open)
    return () => document.body.classList.remove('nav-drawer-open')
  }, [open])

  return (
    <header className="navbar">
      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="container navbar-inner">
        <a className="brand brand-wrap" href="#top" onClick={(e) => handleNavClick(e, 'top')}>
          <img className="brand-logo" src={logoImg} alt="EMEKSON logo" />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="btn btn-ghost"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px' }}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

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

        <nav
          id="primary-nav"
          className={`nav-links ${open ? 'nav-links-open' : ''}`}
          aria-label="Primary"
        >
          {items.map((item) => (
            <a
              key={item.id}
              className="nav-link"
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
            </a>
          ))}  
        </nav>
      </div>
    </header>
  )
}

