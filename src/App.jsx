import { useEffect, useState } from 'react'

import './App.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminMessages from './components/AdminMessages'

import { portfolio } from './data/portfolio'

const THEME_STORAGE_KEY = 'portfolio-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return 'dark'
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'))
  }

  const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/admin'

  if (isAdminPage) {
    return (
      <div id="top">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="main-content admin-main" tabIndex={-1}>
          <AdminMessages />
        </main>
      </div>
    )
  }

  return (
    <div id="top">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar profile={portfolio.profile} theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Hero profile={portfolio.profile} />
        <About profile={portfolio.profile} />
        <Skills skills={portfolio.skills} />
        <Projects projects={portfolio.projects} />
        <Education education={portfolio.education} />
        <Contact contact={portfolio.contact} />
      </main>
      <Footer profile={portfolio.profile} />
    </div>
  )
}

export default App
