function SkillTags({ tags }) {
  return (
    <div className="tag-row" aria-label="Skill tags">
      {tags.map((t) => (
        <span key={t} className="tag">
          {t}
        </span>
      ))}
    </div>
  )
}

export default function Skills({ skills }) {
  return (
    <section id="skills" className="section">
      <div className="section-head">
        <p className="kicker">Skills</p>
        <h2 className="section-title">Tools I use (and keep improving)</h2>
      </div>

      <div className="skill-grid">
        {(skills ?? []).map((cat) => (
          <div key={cat.title} className="card">
            <h3 className="card-title">{cat.title}</h3>
            <SkillTags tags={cat.tags ?? []} />
          </div>
        ))}
      </div>
    </section>
  )
}

