import profileImg from '../assets/profile.png'

import Button from './Button'

export default function Hero({ profile }) {
  return (
    <section id="home" className="section hero-section">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="kicker">Full-Stack Developer Student</p>
          <h1 className="hero-title">
            {profile?.name ?? 'Your Name'}
          </h1>
          <p className="hero-subtitle">{profile?.tagline ?? 'Building modern web apps with React.'}</p>

          <div className="hero-actions">
            <Button href="#projects" variant="primary" ariaLabel="Jump to projects">
              View Projects
            </Button>
            <Button href="#contact" variant="ghost" ariaLabel="Jump to contact">
              Contact
            </Button>
          </div>

          <div className="hero-badges" aria-label="Quick highlights">
            {(profile?.highlights ?? ['React', 'Node.js', 'SQL']).slice(0, 3).map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-media">
          <div className="profile-card">
            <img className="profile-img" src={profileImg} alt={`${profile?.name ?? 'Student'} profile`} />
            <div className="profile-meta">
              <div className="profile-name">{profile?.name ?? 'Your Name'}</div>
              <div className="profile-matricule">Matricule: {profile?.matricule ?? 'N/A'}</div>
              <div className="profile-role">{profile?.role ?? 'Full-Stack Developer Student'}</div>
              <div className="profile-loc">{profile?.location ?? 'Your City'}</div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">{profile?.stats?.projects ?? '3+'}</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat">
              <div className="stat-value">{profile?.stats?.skills ?? '10+'}</div>
              <div className="stat-label">Skills</div>
            </div>
            <div className="stat">
              <div className="stat-value">{profile?.stats?.years ?? '1+'}</div>
              <div className="stat-label">Learning</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

