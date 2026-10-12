import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes, FaDownload } from 'react-icons/fa'

export default function ProfileModal({ isOpen, onClose, imageSrc, name, role, location }) {
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  const modalContent = (
    <div 
      className="profile-modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full size profile photo"
    >
      <div 
        className="profile-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose} 
          className="profile-modal-close"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Modal Header */}
        <div className="profile-modal-header">
          <div className="profile-modal-header-text">
            <h3 className="profile-modal-title">{name || 'Tadia Fonge Emekson'}</h3>
            <p className="profile-modal-subtitle">{role || 'Software Engineer | Full-Stack & Web Developer'}</p>
          </div>
          {location && (
            <span className="profile-modal-location-badge">{location}</span>
          )}
        </div>

        {/* Full Image Container */}
        <div className="profile-modal-image-wrapper">
          <img 
            src={imageSrc} 
            alt={name ? `${name} full size photo` : 'Full profile photo'} 
            className="profile-modal-image"
          />
        </div>

        {/* Modal Footer */}
        <div className="profile-modal-footer">
          <a 
            href={imageSrc} 
            download="tadia-fonge-emekson.jpg"
            className="btn btn-secondary profile-modal-btn"
          >
            <FaDownload /> <span>Download</span>
          </a>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-primary profile-modal-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
