import { useState } from 'react'
import { FaAward, FaGraduationCap, FaBriefcase, FaLanguage, FaHeart, FaCertificate } from 'react-icons/fa'
import CertificateModal from './CertificateModal'
import certKiama from '../assets/cert-kiama.jpg'
import certSigeris from '../assets/cert-sigeris.jpg'

export default function Education({ 
  education, 
  educationHistory, 
  experience, 
  languages, 
  qualities, 
  interests, 
  educationSection,
  ui
}) {
  const [selectedCert, setSelectedCert] = useState(null)

  const certificates = {
    kiama: certKiama,
    sigeris: certSigeris
  }

  const internships = (experience ?? []).filter(exp => 
    exp.title.toLowerCase().includes('internship') || exp.title.toLowerCase().includes('stage')
  )

  const additionalEducation = (educationHistory ?? []).filter(edu => 
    !edu.degree.includes('B-TECH') && !edu.degree.includes('Génie Logiciel')
  )

  return (
    <section id="education" className="section">
      <div className="section-head">
        <p className="kicker">{educationSection?.title ?? 'Journey & Credentials'}</p>
        <h2 className="section-title">{educationSection?.subtitle ?? "Academic Journey & Industry Experience"}</h2>
        <p className="section-subtitle">
          {educationSection?.description ?? 'Continuous learning path combining rigorous university software engineering with hands-on enterprise internships.'}
        </p>
      </div>

      <div className="section-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '32px' }}>
        {/* Left Column: Education & Experience Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main University Program */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <FaGraduationCap />
              </div>
              <div>
                <span className="kicker" style={{ fontSize: '11px', margin: 0 }}>
                  {educationSection?.universityDegreeTitle ?? 'University Degree'}
                </span>
              </div>
            </div>

            <h3 className="card-title" style={{ fontSize: '20px', marginBottom: '4px' }}>
              {education?.degree ?? 'Bachelor of Technology (B-Tech) in Software Engineering'}
            </h3>
            <p style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
              {education?.school ?? 'College of Technology, University of Buea'} • {education?.period ?? '2023 - Present'}
            </p>
            <p className="muted" style={{ fontSize: '14px' }}>
              {education?.summary ?? 'Focused curriculum on algorithms, database systems, web architecture, and full-stack software development.'}
            </p>

            {additionalEducation.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                {additionalEducation.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: idx < additionalEducation.length - 1 ? '10px' : 0 }}>
                    <p style={{ fontWeight: '700', color: 'var(--text-h)', fontSize: '14px' }}>{edu.degree}</p>
                    <p className="muted" style={{ fontSize: '13px' }}>{edu.school} • {edu.period}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internships & Work Experience */}
          {internships.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <FaBriefcase />
                </div>
                <h3 className="card-title" style={{ margin: 0 }}>
                  {educationSection?.internshipsTitle ?? 'Industry Internships'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {internships.map((exp, idx) => (
                  <div key={idx} style={{ paddingBottom: idx < internships.length - 1 ? '16px' : 0, borderBottom: idx < internships.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <p style={{ fontWeight: '800', color: 'var(--text-h)', fontSize: '16px' }}>{exp.title}</p>
                        <p style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '600' }}>{exp.company} • {exp.period}</p>
                      </div>

                      {exp.certKey && (
                        <button
                          onClick={() => setSelectedCert({
                            imageSrc: certificates[exp.certKey],
                            title: exp.title,
                            company: exp.company,
                            period: exp.period
                          })}
                          className="btn-cert-cta"
                          style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                          <FaCertificate />
                          {ui?.viewCertificate ?? 'View Certificate'}
                        </button>
                      )}
                    </div>
                    <p className="muted" style={{ fontSize: '14px', marginTop: '8px' }}>{exp.details[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Languages, Soft Skills, Interests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Languages */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FaLanguage style={{ color: 'var(--accent)' }} />
              {educationSection?.languages ?? 'Languages'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(languages ?? []).map((l, i) => (
                <div key={i} className="tag-pill" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-h)', padding: '6px 14px' }}>
                  <strong>{l.name}:</strong> {l.level}
                </div>
              ))}
            </div>
          </div>

          {/* Qualities & Mindset */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FaAward style={{ color: 'var(--accent-cyan)' }} />
              {educationSection?.qualities ?? 'Qualities & Mindset'}
            </h3>
            <ul className="checklist">
              {(qualities ?? []).map((q, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-h)' }}>
                  <div className="checklist-icon" style={{ width: '22px', height: '22px', fontSize: '11px' }}>✓</div>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interests */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FaHeart style={{ color: '#f43f5e' }} />
              {educationSection?.interests ?? 'Interests'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(interests ?? []).map((interest, i) => (
                <span key={i} className="tag-pill" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        imageSrc={selectedCert?.imageSrc}
        title={selectedCert?.title}
        company={selectedCert?.company}
        period={selectedCert?.period}
        ui={ui}
      />
    </section>
  )
}
