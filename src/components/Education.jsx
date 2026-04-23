export default function Education({ education }) {
  return (
    <section id="education" className="section">
      <div className="section-head">
        <p className="kicker">Education</p>
        <h2 className="section-title">{education?.school ?? 'Your College'}</h2>
      </div>

      <div className="section-grid">
        <div className="card">
          <h3 className="card-title">{education?.degree ?? 'Full-Stack Program'} 2022-2026</h3>
          <p className="muted">
            {education?.department ?? 'College of Technology'} - {education?.location ?? ''}
          </p>
          <p className="muted">{education?.summary ?? 'A focused learning path across frontend, backend, and databases.'}</p>
        </div>
        <div className="card">
          <h3 className="card-title">Academic Intership</h3>
          <p className="muted"><strong>jully-September 2024 at</strong> <a href="https://kiama.cm"><strong>KIAMA SA</strong></a></p>
          <p className="muted"><strong>june-August 2023 at </strong> <a href="https://sigeris.cm"><strong>SIGERIS Sarl</strong></a></p>
        </div>
        <div className="card">
          <h3 className="card-title">Secondery School Degree</h3>
          <p className="muted"><a href="https://officedubac.cm/examen-esg/"><strong>BACCALAUREAT D</strong></a> LY-BI-GOUACHE <strong>2021-2022</strong></p>
          <p className="muted"><a href="https://officedubac.cm/examen-esg/"><strong>PROBATOIRE D</strong></a> LY-BI-GOUACHE <strong>2020-2021</strong></p>
          <p className="muted"><a href="https://www.minesec.gov.cm"><strong>BEPC</strong></a> LY-BI-BA-RU <strong>2016-2017</strong></p>
          <p className="muted"><a href="https://www.minedub.cm"><strong>CEP/ENTREE EN 6e</strong></a> SAINT MATHIAS DE KAMKOP <strong>2011-2012</strong></p>
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

