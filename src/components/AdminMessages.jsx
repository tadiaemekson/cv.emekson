import { useCallback, useEffect, useState } from 'react'

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const loadMessages = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/messages')
      if (!res.ok) throw new Error('Could not fetch messages.')
      const data = await res.json()
      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Failed to load messages. Make sure backend is running.')
    }
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return (
    <div className="admin-page">
      <p className="admin-back">
        <a className="text-link" href="/">
          Back to portfolio
        </a>
      </p>
      <div className="admin-head">
        <h1 className="section-title">Admin - Contact Messages</h1>
        <button className="btn btn-secondary" type="button" onClick={loadMessages}>
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
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Time:</strong> {formatDate(item.createdAt)}</p>
              <p><strong>Message:</strong></p>
              <p className="muted admin-message-body">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

