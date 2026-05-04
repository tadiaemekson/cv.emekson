import { useCallback, useEffect, useState } from 'react'
import { FaSync, FaUser, FaEnvelope, FaClock, FaArrowLeft } from 'react-icons/fa'

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

export default function AdminMessages({ token }) {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const loadMessages = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/messages', {
        headers: { 'X-Admin-Secret': token }
      })
      if (!res.ok) throw new Error('Could not fetch messages.')
      const data = await res.json()
      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Failed to load messages. Make sure backend is running.')
    }
  }, [token])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return (
    <div className="admin-page">
      <p className="admin-back">
        <a className="text-link" href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FaArrowLeft /> Back to portfolio
        </a>
      </p>
      <div className="admin-head">
        <h1 className="section-title">Admin - Contact Messages</h1>
        <button className="btn btn-secondary" type="button" onClick={loadMessages} disabled={status === 'loading'}>
          <FaSync className={status === 'loading' ? 'animate-spin' : ''} style={{ marginRight: '8px' }} />
          Refresh
        </button>
      </div>

      {status === 'loading' && <p className="muted">Loading messages...</p>}
      {status === 'error' && <p className="contact-note contact-note-error">{error}</p>}

      {status === 'success' && messages.length === 0 && (
        <p className="muted">No messages yet.</p>
      )}

      {status === 'success' && messages.length > 0 && (
        <div className="admin-list">
          {messages.map((item) => (
            <article key={item.id} className="card admin-card">
              <p><FaUser style={{ color: 'var(--accent)', marginRight: '8px' }} /><strong>Name:</strong> {item.name}</p>
              <p><FaEnvelope style={{ color: 'var(--accent)', marginRight: '8px' }} /><strong>Email:</strong> {item.email}</p>
              <p><FaClock style={{ color: 'var(--accent)', marginRight: '8px' }} /><strong>Time:</strong> {formatDate(item.createdAt)}</p>
              <p style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}><strong>Message:</strong></p>
              <p className="muted admin-message-body">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

