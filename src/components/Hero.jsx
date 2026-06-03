import profileImg from '../assets/profile.jpg'
import { FaProjectDiagram, FaEnvelope } from 'react-icons/fa'

import Button from './Button'
import ResumeButton from './ResumeButton'
import TechScene from './TechScene'

export default function Hero({ profile, heroContent, content, ui, lang }) {
  return (
    <section id="home" className="section hero-section">
      <div className="hero-grid">
        {/* Left Column: Media (Photo & 3D elements) */}
        <div className="hero-media">
          <div className="hero-scene-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TechScene />
            <div className="profile-overlay" style={{ marginTop: '-80px', zIndex: 10, position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img className="profile-img" src={profileImg} alt={`${profile?.name ?? 'Student'} profile`} style={{ width: '240px', height: '240px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Right Column: Copy (Text, Actions, Stats) */}
        <div className="hero-copy">
          <div className="availability-tag">
            <span className="dot"></span>
            {lang === 'en' ? 'OPEN FOR WORK • BUEA, CAMEROON' : 'DISPONIBLE EN DIRECT • BUEA, CAMEROUN'}
          </div>

          <h1 className="hero-title">
            Tadia Fonge <br />
            <span className="gradient-text">EMEKSON</span>
          </h1>

          <p className="hero-subtitle">{profile?.role ?? heroContent?.kicker}</p>
          <p className="hero-description">{heroContent?.tagline ?? 'Building modern full-stack web applications with React.'}</p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-gradient-pill">
              <FaEnvelope style={{ marginRight: '8px' }} /> {heroContent?.contactMe ?? 'Contact Me'}
            </a>
            <a href="#projects" className="btn btn-glass-pill">
              <FaProjectDiagram style={{ marginRight: '8px' }} /> {heroContent?.viewProjects ?? 'View Projects'}
            </a>
            <ResumeButton portfolio={content} ui={ui} />
          </div>

          <div className="hero-stats-grid">
            <div className="stat-card">
              <span className="stat-number">{profile?.stats?.years ?? '3+'}</span>
              <span className="stat-desc">{lang === 'en' ? 'Years of study' : "Années d'études"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{profile?.stats?.projects ?? '6+'}</span>
              <span className="stat-desc">{lang === 'en' ? 'Projects built' : 'Projets réalisés'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{profile?.stats?.skills ?? '12+'}</span>
              <span className="stat-desc">{lang === 'en' ? 'Skills mastered' : 'Compétences'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-desc">{lang === 'en' ? 'Commitment' : 'Engagement'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
