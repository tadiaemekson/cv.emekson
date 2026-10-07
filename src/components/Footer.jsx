import { FaArrowUp } from 'react-icons/fa'

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p style={{ fontWeight: '700', color: 'var(--text-h)', marginBottom: '4px' }}>
            {profile?.name ?? 'TADIA FONGE EMEKSON'}
          </p>
          <p className="muted" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with React, Vite & Three.js • © {currentYear} All rights reserved.
          </p>
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
