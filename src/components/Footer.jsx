import { FaArrowUp } from 'react-icons/fa'
import logoImg from '../assets/logo.png'

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={logoImg} 
            alt="EMEKSON logo" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              objectFit: 'cover',
              border: '1px solid var(--border)' 
            }} 
          />
          <div>
            <p style={{ fontWeight: '700', color: 'var(--text-h)', marginBottom: '2px' }}>
              {profile?.name ?? 'TADIA FONGE EMEKSON'}
            </p>
            <p className="muted" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Full-Stack Developer • © {currentYear} All rights reserved.
            </p>
          </div>
        </div>

        <button 
          onClick={scrollToTop} 
          className="btn-back-to-top"
          aria-label="Back to top"
        >
          <FaArrowUp /> Back to top
        </button>
      </div>
    </footer>
  )
}
