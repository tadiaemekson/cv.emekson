import profileImg from '../assets/profile.jpg'
import { FaEnvelope, FaProjectDiagram, FaLaptopCode, FaAward, FaRocket, FaCertificate } from 'react-icons/fa'
import { SiReact, SiNodedotjs, SiLaravel, SiPostgresql, SiTypescript } from 'react-icons/si'

import ResumeButton from './ResumeButton'
import TechScene from './TechScene'

export default function Hero({ profile, heroContent, content, ui, lang }) {
  return (
    <section id="home" className="section hero-section">
      <div className="hero-grid">
        {/* Left Column: Media with Avatar & Floating Tech Badges */}
        <div className="hero-media">
          <div className="hero-scene-wrapper">
            <TechScene />
            
            <div className="profile-container">
              <div className="profile-glow-ring"></div>
              <img 
                className="profile-img" 
                src={profileImg} 
                alt={`${profile?.name ?? 'Student'} profile`} 
              />

              {/* Orbiting Badges */}
              <div className="floating-badge badge-react">
                <SiReact /> <span>React 19</span>
              </div>
              <div className="floating-badge badge-laravel">
                <SiLaravel /> <span>Laravel</span>
              </div>
              <div className="floating-badge badge-node">
                <SiNodedotjs /> <span>Node.js</span>
              </div>
              <div className="floating-badge badge-db">
                <SiPostgresql /> <span>SQL / DB</span>
              </div>
              <div className="floating-badge badge-ts">
                <SiTypescript /> <span>TypeScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Copy, Badges, CTAs, Stats */}
        <div className="hero-copy">
          <div className="availability-tag">
            <span className="dot"></span>
            {heroContent?.availability ?? (lang === 'en' ? 'OPEN FOR WORK • BUEA, CAMEROON' : 'DISPONIBLE EN DIRECT • BUEA, CAMEROUN')}
          </div>

          <h1 className="hero-title">
            Tadia Fonge <br />
            <span className="gradient-text">EMEKSON</span>
          </h1>

          <p className="hero-subtitle">{profile?.role ?? heroContent?.kicker}</p>
          <p className="hero-description">{heroContent?.tagline ?? 'Building modern full-stack web applications with React, Laravel, and Node.js.'}</p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-gradient-pill">
              <FaEnvelope /> {heroContent?.contactMe ?? (lang === 'en' ? 'Contact Me' : 'Me Contacter')}
            </a>
            <a href="#projects" className="btn btn-glass-pill">
              <FaProjectDiagram /> {heroContent?.viewProjects ?? (lang === 'en' ? 'View Projects' : 'Voir les Projets')}
            </a>
            <ResumeButton portfolio={content} ui={ui} />
          </div>

          <div style={{ marginTop: '20px', marginBottom: '8px' }}>
            <a href="#education" className="btn-cert-cta">
              <FaCertificate />
              {heroContent?.viewCertifications ?? (lang === 'en' ? 'View my verified certifications →' : 'Voir mes certifications vérifiées →')}
            </a>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-card">
              <FaLaptopCode className="stat-card-icon" />
              <span className="stat-number">{profile?.stats?.years ?? '3+'}</span>
              <span className="stat-desc">{heroContent?.stats?.years ?? (lang === 'en' ? 'Years Exp' : "Années d'exp")}</span>
            </div>
            <div className="stat-card">
              <FaProjectDiagram className="stat-card-icon" />
              <span className="stat-number">{profile?.stats?.projects ?? '8+'}</span>
              <span className="stat-desc">{heroContent?.stats?.projects ?? (lang === 'en' ? 'Projects Built' : 'Projets Réalisés')}</span>
            </div>
            <div className="stat-card">
              <FaAward className="stat-card-icon" />
              <span className="stat-number">{profile?.stats?.skills ?? '12+'}</span>
              <span className="stat-desc">{heroContent?.stats?.skills ?? (lang === 'en' ? 'Core Skills' : 'Compétences Clés')}</span>
            </div>
            <div className="stat-card">
              <FaRocket className="stat-card-icon" />
              <span className="stat-number">100%</span>
              <span className="stat-desc">{heroContent?.stats?.commitment ?? (lang === 'en' ? 'Dedication' : 'Engagement')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
