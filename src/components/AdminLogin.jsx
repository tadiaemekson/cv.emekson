import { useState } from 'react'
import { FaSignInAlt, FaArrowLeft } from 'react-icons/fa'
import logoImg from '../assets/logo.png'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()
      if (res.ok) {
        onLogin(data.token)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Connection failed. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page" style={{ maxWidth: '420px', margin: '40px auto', textAlign: 'center' }}>
      <img 
        src={logoImg} 
        alt="EMEKSON Logo" 
        style={{ width: '64px', height: '64px', borderRadius: '16px', marginBottom: '16px', border: '2px solid var(--accent-border)' }} 
      />
      <h1 className="section-title" style={{ fontSize: '26px' }}>Admin Dashboard</h1>
      <p className="muted" style={{ marginBottom: '24px' }}>Security check required.</p>
      
      <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="password"
          className="modern-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter administrator password..."
          autoFocus
        />
        {error && <p className="contact-note-error" style={{ fontSize: '14px' }}>{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ borderRadius: '12px' }}>
          {loading ? 'Verifying...' : <><FaSignInAlt style={{ marginRight: '8px' }} /> Access Admin Panel</>}
        </button>
      </form>
      
      <p style={{ marginTop: '24px' }}>
        <a className="text-link" href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FaArrowLeft /> Back to Portfolio
        </a>
      </p>
    </div>
  )
}
