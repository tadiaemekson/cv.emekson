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
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import AIAssistant from './components/AIAssistant'

import { portfolio as defaultPortfolio } from './data/portfolio'

const LANG_STORAGE_KEY = 'portfolio-lang'
const ADMIN_TOKEN_KEY = 'admin-token'
const PORTFOLIO_CUSTOM_KEY = 'portfolio-custom-data'

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

function getInitialPortfolio() {
  if (typeof window === 'undefined') return defaultPortfolio
  try {
    const saved = window.localStorage.getItem(PORTFOLIO_CUSTOM_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed?.en && parsed?.fr) return parsed
    }
  } catch {
    // fallback
  }
  return defaultPortfolio
}

function App() {
  const theme = 'dark'
  const [lang, setLang] = useState(getInitialLang)
  const [adminToken, setAdminToken] = useState(getInitialAdminToken)
  const [portfolioData, setPortfolioData] = useState(getInitialPortfolio)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  // Fetch live portfolio data from backend/Supabase on load
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data?.portfolio?.en && data?.portfolio?.fr) {
          setPortfolioData(data.portfolio)
          window.localStorage.setItem(PORTFOLIO_CUSTOM_KEY, JSON.stringify(data.portfolio))
        }
      })
      .catch(() => {
        // use default/local cache
      })
  }, [])

  function toggleLang() {
    setLang((curr) => (curr === 'en' ? 'fr' : 'en'))
  }

  function handleAdminLogin(token) {
    setAdminToken(token)
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token)
  }

  function handleAdminLogout() {
    setAdminToken(null)
    window.localStorage.removeItem(ADMIN_TOKEN_KEY)
  }

  function handlePortfolioUpdate(newData) {
    setPortfolioData(newData)
    window.localStorage.setItem(PORTFOLIO_CUSTOM_KEY, JSON.stringify(newData))
  }

  const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/admin'

  const content = portfolioData[lang] || defaultPortfolio[lang]

  if (isAdminPage) {
    return (
      <div id="top">
        <CustomCursor />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="main-content admin-main" tabIndex={-1}>
          {adminToken ? (
            <AdminDashboard
              token={adminToken}
              onLogout={handleAdminLogout}
              initialPortfolio={portfolioData}
              onPortfolioUpdate={handlePortfolioUpdate}
            />
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
      <AIAssistant 
        key={lang} 
        portfolio={content} 
        aiContent={content.ai} 
        portfolioData={portfolioData}
        lang={lang}
      />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar 
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
            lang={lang}
          />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.2s' }}>
          <About 
            profile={content.profile} 
            aboutContent={content.about} 
          />
        </div>
        <div className="animate-in" style={{ animationDelay: '0.3s' }}>
          <Skills 
            skills={content.skills} 
            skillsSection={content.skillsSection}
          />
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
            lang={lang}
          />
        </div>
      </main>
      <Footer 
        profile={content.profile} 
        footerLabels={content.footer} 
        navLabels={content.nav}
        ui={content.ui}
      />
    </div>
  )
}

export default App
