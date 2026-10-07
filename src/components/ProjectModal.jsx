import { useEffect } from 'react'
import { FaGithub, FaExternalLinkAlt, FaTimes, FaLayerGroup, FaInfoCircle } from 'react-icons/fa'

export default function ProjectModal({ project, onClose, ui }) {
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
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 6, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="card" 
        onClick={e => e.stopPropagation()} 
        style={{
          maxWidth: '750px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '36px 32px',
          border: '1px solid var(--accent-border)',
          background: 'var(--bg-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'var(--text-h)',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }} 
          aria-label={ui?.close ?? 'Close'}
        >
          <FaTimes />
        </button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="kicker" style={{ margin: 0 }}>
            <FaInfoCircle /> {ui?.caseStudy ?? 'Project Deep Dive'}
          </span>
        </div>

        <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '16px' }}>
          {project.title}
        </h2>
        
        <div className="tag-row" style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(project.tech ?? []).map(t => (
            <span key={t} className="tag-pill" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '28px', background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '16px' }}>
            <FaLayerGroup style={{ color: 'var(--accent)' }} />
            {ui?.projectOverview ?? 'Overview & Architecture'}
          </h3>
          <p className="muted" style={{ lineHeight: '1.8', fontSize: '15px' }}>
            {project.details || project.description}
          </p>
        </div>

        <div className="hero-actions" style={{ marginTop: '24px' }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-primary">
              <FaGithub /> {ui?.viewRepository ?? 'View Source on GitHub'}
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <FaExternalLinkAlt /> {ui?.livePreview ?? 'Live Preview'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
