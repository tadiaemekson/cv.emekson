import profileImg from '../assets/profile.png'
import { FaProjectDiagram, FaEnvelope } from 'react-icons/fa'

import Button from './Button'
import ResumeButton from './ResumeButton'
import TechScene from './TechScene'

export default function Hero({ profile, heroContent, content, ui }) {
  return (
    <section id="home" className="section hero-section">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="kicker">{heroContent?.kicker ?? 'Full-Stack Developer Student'}</p>
          <h1 className="hero-title">
            {profile?.name ?? 'Your Name'}
          </h1>
          <p className="hero-subtitle">{heroContent?.tagline ?? 'Building modern web apps with React.'}</p>

          <div className="hero-actions">
            <Button href="#projects" variant="primary" ariaLabel="Jump to projects">
              <FaProjectDiagram style={{ marginRight: '8px' }} /> {heroContent?.viewProjects ?? 'View Projects'}
            </Button>
            <Button href="#contact" variant="secondary" ariaLabel="Jump to contact">
              <FaEnvelope style={{ marginRight: '8px' }} /> {heroContent?.contactMe ?? 'Contact Me'}
            </Button>
          </div>
          <ResumeButton portfolio={content} ui={ui} />
        </div>

        <div className="hero-media">
          <div className="hero-scene-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TechScene />
            <div className="profile-overlay" style={{ marginTop: '-80px', zIndex: 10, position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img className="profile-img" src={profileImg} alt={`${profile?.name ?? 'Student'} profile`} style={{ width: '120px', height: '120px' }} />
              
              <div className="hero-stats" style={{ marginTop: '24px' }}>
                <div className="stat">
                  <span className="stat-value">{profile?.stats?.projects ?? '3+'}</span>
                  <span className="stat-label">{heroContent?.stats?.projects ?? 'Projects'}</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile?.stats?.skills ?? '10+'}</span>
                  <span className="stat-label">{heroContent?.stats?.skills ?? 'Skills'}</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile?.stats?.years ?? '1+'}</span>
                  <span className="stat-label">{heroContent?.stats?.years ?? 'Years'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
