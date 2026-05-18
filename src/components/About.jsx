export default function About({ profile, aboutContent }) {
  return (
    <section id="about" className="section about-section">
      <div className="section-head">
        <p className="kicker">{aboutContent?.kicker ?? 'About Me'}</p>
        <h2 className="section-title">{aboutContent?.title ?? 'A quick story about what I\'m building'}</h2>
      </div>

      <div className="section-grid">
        <div className="card">
          <p className="lead">
            {aboutContent?.bio ?? profile?.bio ?? "I'm a full-stack developer student who loves building real products."}
          </p>
          <p className="muted">
            {aboutContent?.extra ?? "I enjoy working across the stack: frontend UI, backend APIs, and databases. I'm currently focusing on building projects that are clean, responsive, and easy to maintain."}
          </p>
        </div>

        <div className="card">
          <h3 className="card-title">{aboutContent?.valuesTitle ?? 'What I care about'}</h3>
          <ul className="checklist">
            {(profile?.values ?? ['Clean UI', 'Practical backend', 'Good teamwork']).map((v) => (
              <li key={v}>
                <span className="check" aria-hidden="true">
                  *
                </span>
                {v}
              </li>
            ))}
          </ul>
          <div className="about-links">
            <a className="text-link" href="#projects">
              {aboutContent?.exploreProjects ?? 'Explore my projects'} -{'>'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
