export default function Education({ 
  education, 
  educationHistory, 
  experience, 
  languages, 
  qualities, 
  interests, 
  educationSection 
}) {
  const internships = (experience ?? []).filter(exp => 
    exp.title.toLowerCase().includes('internship') || exp.title.toLowerCase().includes('stage')
  )
  const otherEducation = (educationHistory ?? []).filter(edu => 
    !edu.degree.includes('B-TECH') && !edu.degree.includes('Génie Logiciel')
  )

  return (
    <section id="education" className="section">
      <div className="section-head">
        <p className="kicker">{educationSection?.title ?? 'Experience & Education'}</p>
        <h2 className="section-title">{educationSection?.subtitle ?? 'A journey of continuous learning'}</h2>
      </div>

      <div className="section-grid">
        {/* Current Program */}
        <div className="card">
          <h3 className="card-title">{educationSection?.education ?? 'Education'}</h3>
          <p className="lead" style={{ marginBottom: '8px' }}>{education?.degree ?? 'Full-Stack Program'}</p>
          <p className="muted" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{education?.period ?? '2023 - Present'}</p>
          <p className="muted" style={{ marginBottom: '12px' }}>
            {education?.school ?? 'College of Technology'} - {education?.location ?? ''}
          </p>
          <p className="muted">{education?.summary ?? 'A focused learning path across frontend, backend, and databases.'}</p>
        </div>

        {/* Internships */}
        {internships.length > 0 && (
          <div className="card">
            <h3 className="card-title">{educationSection?.experience ?? 'Experience'}</h3>
            {internships.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: idx < internships.length - 1 ? '16px' : 0 }}>
                <p className="muted" style={{ fontWeight: '700', color: 'var(--text-color)' }}>
                  {exp.title}
                </p>
                <p className="muted" style={{ fontSize: '0.9em' }}>
                   {exp.company} | {exp.period}
                </p>
                <p className="muted" style={{ fontSize: '0.85em', marginTop: '4px' }}>{exp.details[0]}</p>
              </div>
            ))}
          </div>
        )}

        {/* Other Education */}
        {otherEducation.length > 0 && (
          <div className="card">
            <h3 className="card-title">{educationSection?.education ?? 'Education'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {otherEducation.map((edu, idx) => (
                <div key={idx}>
                  <p className="muted" style={{ fontWeight: '700', color: 'var(--text-color)', marginBottom: '2px' }}>
                    {edu.degree}
                  </p>
                  <p className="muted" style={{ fontSize: '0.9em' }}>
                    {edu.school} | {edu.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Qualities */}
        <div className="card">
          <h3 className="card-title">{educationSection?.languages ?? 'Languages'}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {(languages ?? []).map((l, i) => (
              <span key={i} className="tag" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                {l.name}: {l.level}
              </span>
            ))}
          </div>

          <h3 className="card-title">{educationSection?.qualities ?? 'Other Qualities'}</h3>
          <ul className="checklist" style={{ marginBottom: '20px' }}>
            {(qualities ?? []).map((q, i) => (
              <li key={i}>
                <span className="check" aria-hidden="true">*</span>
                {q}
              </li>
            ))}
          </ul>

          <h3 className="card-title">{educationSection?.interests ?? 'Interests'}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(interests ?? []).map((interest, i) => (
              <span key={i} className="tag" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
