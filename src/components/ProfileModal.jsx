import { useEffect } from 'react'
import { FaTimes, FaDownload } from 'react-icons/fa'

export default function ProfileModal({ isOpen, onClose, imageSrc, name, role, location }) {
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
          <div>
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
            <FaDownload /> Download Full Photo
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
}
