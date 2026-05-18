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
import AdminLogin from './components/AdminLogin'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import AIAssistant from './components/AIAssistant'

import { portfolio } from './data/portfolio'

const THEME_STORAGE_KEY = 'portfolio-theme'
const LANG_STORAGE_KEY = 'portfolio-lang'
const ADMIN_TOKEN_KEY = 'admin-token'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return 'dark'
}

function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY)
  if (saved === 'en' || saved === 'fr') return saved
  return 'en'
}

function getInitialAdminToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ADMIN_TOKEN_KEY)
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [lang, setLang] = useState(getInitialLang)
  const [adminToken, setAdminToken] = useState(getInitialAdminToken)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  function toggleTheme() {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'))
  }

  function toggleLang() {
    setLang((curr) => (curr === 'en' ? 'fr' : 'en'))
  }

  function handleAdminLogin(token) {
    setAdminToken(token)
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token)
  }

  const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/admin'

  const content = portfolio[lang]

  if (isAdminPage) {
    return (
      <div id="top">
        <CustomCursor />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="main-content admin-main" tabIndex={-1}>
          {adminToken ? (
            <AdminMessages token={adminToken} />
          ) : (
            <AdminLogin onLogin={handleAdminLogin} />
          )}
        </main>
      </div>
    )
  }

  return (
    <div id="top">
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
        <div className="mesh-blob blob-3"></div>
      </div>
      <CustomCursor />
      <ScrollProgress />
      <AIAssistant key={lang} portfolio={content} aiContent={content.ai} />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        lang={lang} 
        onToggleLang={toggleLang}
        navLabels={content.nav}
      />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          <Hero 
            profile={content.profile} 
            heroContent={content.hero} 
            content={content}
            ui={content.ui}
          />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.2s' }}>
          <About 
            profile={content.profile} 
            aboutContent={content.about} 
          />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.3s' }}>
          <Skills skills={content.skills} />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.4s' }}>
          <Projects 
            projects={content.projects} 
            projectsSection={content.projectsSection}
            ui={content.ui} 
          />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.5s' }}>
          <Education 
            education={content.education} 
            educationHistory={content.educationHistory} 
            experience={content.experience}
            languages={content.languages}
            qualities={content.qualities}
            interests={content.interests}
            educationSection={content.educationSection}
            ui={content.ui}
          />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.6s' }}>
          <Contact 
            contact={content.contact} 
            contactSection={content.contactSection}
          />
        </div>
      </main>
      <Footer 
        profile={content.profile} 
        footerLabels={content.footer} 
        navLabels={content.nav}
      />
    </div>
  )
}

export default App
