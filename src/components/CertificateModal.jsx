import { useEffect } from 'react'
import { FaTimes, FaDownload } from 'react-icons/fa'

export default function CertificateModal({ isOpen, onClose, imageSrc, title, company, period, ui }) {
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 3, 0.85)',
        backdropFilter: 'blur(16px)',
        webkitBackdropFilter: 'blur(16px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="modal-content card certificate-modal" 
        onClick={e => e.stopPropagation()} 
        style={{
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: 'rgba(9, 13, 22, 0.75)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          padding: '28px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.1)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-color)',
            fontSize: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }} 
          className="modal-close-btn"
          aria-label={ui?.close ?? 'Close'}
        >
          <FaTimes />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px', paddingRight: '40px' }}>
          <p className="kicker" style={{ margin: 0, fontSize: '11px', color: 'var(--accent)' }}>
            {company}
          </p>
          <h3 style={{ margin: '4px 0 2px', fontSize: '20px', fontWeight: '800', color: '#fff' }}>
            {title}
          </h3>
          <p className="muted" style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>
            {period}
          </p>
        </div>

        {/* Image Container */}
        <div 
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            position: 'relative'
          }}
        >
          <img 
            src={imageSrc} 
            alt={`Certificate for ${title} at ${company}`} 
            style={{
              maxWidth: '100%',
              maxHeight: '55vh',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <a 
            href={imageSrc} 
            download={`Tadia_Fonge_Emekson_Certificate_${company.replace(/\s+/g, '_')}.jpg`}
            className="btn btn-gradient-pill"
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <FaDownload />
            {ui?.downloadCertificate ?? (ui?.downloadCV ? (ui.downloadCV.includes('Télécharger') ? 'Télécharger' : 'Download') : 'Download')}
          </a>
        </div>
      </div>
    </div>
  )
}
