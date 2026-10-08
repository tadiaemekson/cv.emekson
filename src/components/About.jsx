import { FaCheckCircle, FaMapMarkerAlt, FaGraduationCap, FaCode, FaRocket } from 'react-icons/fa'

export default function About({ profile, aboutContent }) {
  return (
    <section id="about" className="section about-section">
      <div className="section-head">
        <p className="kicker">{aboutContent?.kicker ?? 'About Me'}</p>
        <h2 className="section-title">{aboutContent?.title ?? "A quick story about what I'm building"}</h2>
      </div>

      <div className="bento-grid">
        {/* Bento Card 1: Core Bio & Mission */}
        <div className="card bento-card-main">
          <div>
            <div className="bento-quote">
              "{aboutContent?.quote ?? 'Transforming ideas into resilient, user-friendly, and high-performance applications.'}"
            </div>
            <p className="bento-bio-text">
              {aboutContent?.bio ?? profile?.bio ?? "Motivated and passionate Software Engineering student at the College of Technology, University of Buea, specializing in full-stack web architectures."}
            </p>
          </div>

          <div className="bento-meta-row">
            <div className="bento-meta-item">
              <FaMapMarkerAlt style={{ color: 'var(--accent)' }} />
              <span>{aboutContent?.locationText ?? 'Buea, Cameroon'}</span>
            </div>
            <div className="bento-meta-item">
              <FaGraduationCap style={{ color: 'var(--accent-cyan)' }} />
              <span>{aboutContent?.schoolText ?? 'College of Technology, University of Buea'}</span>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Core Engineering Principles */}
        <div className="card bento-card-values">
          <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaRocket style={{ color: 'var(--accent)' }} />
            {aboutContent?.valuesTitle ?? 'Engineering Principles'}
          </h3>
          <ul className="checklist">
            {(profile?.values ?? ['Clean UI & UX', 'Resilient Backend APIs', 'Scalable Database Schemas', 'Team Collaboration']).map((v) => (
              <li key={v}>
                <div className="checklist-icon">
                  <FaCheckCircle />
                </div>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bento Card 3: What I Focus On */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCode style={{ color: 'var(--accent-cyan)' }} />
            {aboutContent?.focusTitle ?? 'Current Focus'}
          </h3>
          <p className="muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
            {aboutContent?.extra ?? "Building modern full-stack web platforms, exploring Offline-First local synchronization (Dexie.js / IndexedDB), and developing real-time fintech SaaS engines."}
          </p>
          <div>
            <a className="text-link" href="#projects">
              {aboutContent?.exploreProjects ?? 'Explore my featured projects'} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
