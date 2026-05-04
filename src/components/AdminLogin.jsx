import { useState } from 'react'
import { FaLock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa'

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
    <div className="admin-page" style={{ maxWidth: '400px', textAlign: 'center' }}>
      <h1 className="section-title"><FaLock style={{ color: 'var(--accent)', marginRight: '12px' }} />Admin Access</h1>
      <p className="muted" style={{ marginBottom: '24px' }}>Security check required.</p>
      
      <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        {error && <p className="contact-note-error" style={{ fontSize: '14px' }}>{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : <><FaSignInAlt style={{ marginRight: '8px' }} /> Access Panel</>}
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
