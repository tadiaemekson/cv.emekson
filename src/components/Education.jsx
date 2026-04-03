export default function Education({ education }) {
  return (
    <section id="education" className="section">
      <div className="section-head">
        <p className="kicker">Education</p>
        <h2 className="section-title">{education?.school ?? 'Your College'}</h2>
      </div>

      <div className="section-grid">
        <div className="card">
          <h3 className="card-title">{education?.degree ?? 'Full-Stack Program'}</h3>
          <p className="muted">
            {education?.department ?? 'College of Technology'} - {education?.location ?? ''}
          </p>
          <p className="muted">{education?.summary ?? 'A focused learning path across frontend, backend, and databases.'}</p>
        </div>

        <div className="card">
          <h3 className="card-title">Highlights</h3>
          <ul className="checklist">
            {(education?.highlights ?? ['Projects', 'Teamwork', 'Practical labs']).map((h) => (
              <li key={h}>
                <span className="check" aria-hidden="true">
                  *
                </span>
                {h}
              </li>
            ))}
          </ul>
          {education?.gpa && (
            <p className="muted" style={{ marginTop: 12 }}>
              GPA: {education.gpa}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

