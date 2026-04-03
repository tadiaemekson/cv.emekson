import { useMemo, useState } from 'react'

function SocialIcon({ kind }) {
  if (kind === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
        <path
          fill="currentColor"
          d="M12 .7a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.4.7-4.1-1.4-4.1-1.4a3.2 3.2 0 0 0-1.4-1.8c-1.1-.7.1-.7.1-.7a2.5 2.5 0 0 1 1.8 1.2 2.6 2.6 0 0 0 3.6 1 2.7 2.7 0 0 1 .8-1.7c-2.7-.3-5.5-1.3-5.5-6a4.8 4.8 0 0 1 1.3-3.4 4.3 4.3 0 0 1 .1-3.4s1-.3 3.5 1.3a12 12 0 0 1 6.3 0c2.4-1.6 3.4-1.3 3.4-1.3a4.3 4.3 0 0 1 .1 3.4 4.8 4.8 0 0 1 1.3 3.4c0 4.6-2.8 5.6-5.5 6a3 3 0 0 1 .9 2.3v3.5c0 .4.2.7.8.6A12 12 0 0 0 12 .7"
        />
      </svg>
    )
  }

  if (kind === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
        <path
          fill="currentColor"
          d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.8 2.6 4.8 6V21h-4v-5.4c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9z"
        />
      </svg>
    )
  }

  if (kind === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
        <path
          fill="currentColor"
          d="M22 12a10 10 0 1 0-11.6 9.9V15H8.1v-3h2.3V9.7c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12H16l-.4 3h-2.3v6.9A10 10 0 0 0 22 12z"
        />
      </svg>
    )
  }

  if (kind === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
        <path
          fill="currentColor"
          d="M20.5 3.5A11.8 11.8 0 0 0 1.2 17.8L0 24l6.4-1.2A11.8 11.8 0 0 0 24 12 11.7 11.7 0 0 0 20.5 3.5zM12 21a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-3.8.7.7-3.7-.2-.4A9 9 0 1 1 12 21zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.5-.1-.7.2l-.8 1c-.1.2-.3.2-.6.1a7.4 7.4 0 0 1-3.6-3.2c-.2-.2 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6 0-.1 0-.4-.1-.5l-.7-1.8c-.2-.4-.4-.3-.7-.3h-.6a1.2 1.2 0 0 0-.9.4c-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.1.2 2.4 3.7 5.9 5.1 2.3.9 3.6.8 4.8.5.7-.2 1.8-.8 2.1-1.6.2-.8.2-1.4.1-1.6-.1-.1-.3-.2-.6-.4z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
      <path
        fill="currentColor"
        d="M3 5.2A2.2 2.2 0 0 1 5.2 3h13.6A2.2 2.2 0 0 1 21 5.2v13.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 18.8V5.2zm2.2-.2 6.8 5.4L18.8 5H5.2zm13.8 14V7.2l-6.3 5a1.2 1.2 0 0 1-1.4 0l-6.3-5V19h14z"
      />
    </svg>
  )
}

export default function Contact({ contact }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const emailTo = contact?.email ?? 'your@email.com'
  const phones = contact?.phones ?? []

  const subject = useMemo(() => {
    const from = name ? `From: ${name}` : 'New message'
    return `${from} - Portfolio Contact`
  }, [name])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('error')
      setFeedback('Please fill in name, email, and message.')
      return
    }

    setStatus('loading')
    setFeedback('')

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || 'Failed to send message.')
        }
        setStatus('success')
        setFeedback('Message sent successfully. Thank you!')
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch(() => {
        const body = `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`
        const href = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          body,
        )}`
        setStatus('error')
        setFeedback('Backend unavailable, opening your email app instead.')
        window.location.href = href
      })
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="section-head">
        <p className="kicker">Contact</p>
        <h2 className="section-title">Let's build something together</h2>
        <p className="muted">You can send a quick message - I'll get back to you.</p>
      </div>

      <div className="contact-grid">
        <div className="card">
          <h3 className="card-title">Contact details</h3>
          <div className="contact-details">
            <p className="muted">
              <strong>Name:</strong> {contact?.fullName ?? 'Your Name'}
            </p>
            {phones.map((phone) => (
              <p key={phone} className="muted">
                <strong>Phone:</strong>{' '}
                <a className="text-link" href={`tel:${phone.replace(/-/g, '')}`}>
                  {phone}
                </a>
              </p>
            ))}
            <p className="muted">
              <strong>Email:</strong>{' '}
              <a className="text-link" href={`mailto:${emailTo}`}>
                {emailTo}
              </a>
            </p>
          </div>

          <h3 className="card-title" style={{ marginTop: 14 }}>Social links</h3>
          <div className="contact-links">
            {contact?.github && (
              <a className="social-icon-link" href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <SocialIcon kind="github" />
                <span className="sr-only">GitHub</span>
              </a>
            )}
            {contact?.linkedin && (
              <a
                className="social-icon-link"
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <SocialIcon kind="linkedin" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {contact?.facebook && (
              <a
                className="social-icon-link"
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <SocialIcon kind="facebook" />
                <span className="sr-only">Facebook</span>
              </a>
            )}
            {contact?.whatsapp && (
              <a
                className="social-icon-link"
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <SocialIcon kind="whatsapp" />
                <span className="sr-only">WhatsApp</span>
              </a>
            )}
            <a className="social-icon-link" href={`mailto:${emailTo}`} aria-label="Email">
              <SocialIcon kind="email" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>

        <form className="card contact-form" onSubmit={handleSubmit}>
          <h3 className="card-title">Send a message</h3>

          <label className="field">
            <span className="field-label">Your name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emon"
              autoComplete="name"
            />
          </label>

          <label className="field">
            <span className="field-label">Your email</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., emon@gmail.com"
              autoComplete="email"
              type="email"
            />
          </label>

          <label className="field">
            <span className="field-label">Message</span>
            <textarea
              className="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project idea..."
              rows={5}
            />
          </label>

          <button
            className="btn btn-primary contact-submit"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>
          <p
            className={`contact-note ${status === 'error' ? 'contact-note-error' : ''} ${status === 'success' ? 'contact-note-success' : ''}`}
            role="status"
            aria-live="polite"
          >
            {feedback ||
              (status === 'idle' ? 'Your message is sent through the contact API when the server is running.' : '')}
          </p>
        </form>
      </div>
    </section>
  )
}

