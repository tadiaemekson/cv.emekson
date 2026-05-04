import { useMemo, useState } from 'react'
import { FaGithub, FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaUser } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'

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
              <FaUser style={{ marginRight: '8px', color: 'var(--accent)' }} />
              <strong>Name:</strong> {contact?.fullName ?? 'Your Name'}
            </p>
            {phones.map((phone) => (
              <p key={phone} className="muted">
                <FaPhoneAlt style={{ marginRight: '8px', color: 'var(--accent)' }} />
                <strong>Phone:</strong>{' '}
                <a className="text-link" href={`tel:${phone.replace(/-/g, '')}`}>
                  {phone}
                </a>
              </p>
            ))}
            <p className="muted">
              <FaEnvelope style={{ marginRight: '8px', color: 'var(--accent)' }} />
              <strong>Email:</strong>{' '}
              <a className="text-link" href={`mailto:${emailTo}`}>
                {emailTo}
              </a>
            </p>
          </div>

          <h3 className="card-title" style={{ marginTop: 24 }}>Social links</h3>
          <div className="contact-links">
            {contact?.github && (
              <a className="social-icon-link" href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub className="social-icon-svg" />
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
                <FaLinkedin className="social-icon-svg" />
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
                <FaFacebook className="social-icon-svg" />
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
                <FaWhatsapp className="social-icon-svg" />
              </a>
            )}
            <a className="social-icon-link" href={`mailto:${emailTo}`} aria-label="Email">
              <FaEnvelope className="social-icon-svg" />
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
            {status === 'loading' ? 'Sending...' : <><IoSend style={{ marginRight: '8px' }} /> Send message</>}
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

