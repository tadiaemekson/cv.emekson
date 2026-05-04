import { useEffect } from 'react'
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  if (!project) return null

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="modal-content card" onClick={e => e.stopPropagation()} style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--accent-border)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          color: 'var(--text)',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FaTimes />
        </button>

        <p className="kicker">Case Study</p>
        <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '16px' }}>{project.title}</h2>
        
        <div className="tag-row" style={{ marginBottom: '24px' }}>
          {project.tech.map(t => (
            <span key={t} className="tag" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>{t}</span>
          ))}
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 className="card-title">Project Overview</h3>
          <p className="muted" style={{ lineHeight: '1.8' }}>{project.details || project.description}</p>
        </div>

        <div className="hero-actions" style={{ marginTop: '20px' }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-primary">
              <FaGithub style={{ marginRight: '8px' }} /> View Repository
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <FaExternalLinkAlt style={{ marginRight: '8px' }} /> Live Preview
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
