import { useState } from 'react'
import { FaGithub, FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaCheck, FaCopy, FaUser } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'

export default function Contact({ contact, contactSection }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const [copiedField, setCopiedField] = useState(null)

  const emailTo = contact?.email ?? 'tadiaemekson@gmail.com'
  const phones = contact?.phones ?? ['+237 671-550-845', '+237 687-321-447']

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2500)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('error')
      setFeedback(contact?.form?.error || 'Please fill in your name, email, and message.')
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
          throw new Error(data?.error || contact?.form?.error || 'Failed to send message.')
        }
        setStatus('success')
        setFeedback(contact?.form?.success || 'Your message has been sent successfully. Thank you!')
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch(() => {
        const body = `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`
        const href = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(
          `Portfolio Contact from ${payload.name}`,
        )}&body=${encodeURIComponent(body)}`
        setStatus('error')
        setFeedback('Server temporarily busy, opening your default email app...')
        window.location.href = href
      })
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="section-head">
        <p className="kicker">{contactSection?.kicker ?? 'Get in Touch'}</p>
        <h2 className="section-title">{contactSection?.title ?? "Let's Build Something Exceptional Together"}</h2>
        <p className="section-subtitle">
          Have an exciting project, internship opportunity, or question? Send a message or reach out directly.
        </p>
      </div>

      <div className="contact-grid-modern">
        {/* Left Column: Direct Contact Cards & Socials */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '18px', fontSize: '18px' }}>
            {contactSection?.labels?.details ?? 'Direct Contact'}
          </h3>

          {/* Email Quick Card with Copy */}
          <div className="quick-contact-card">
            <div className="quick-contact-info">
              <FaEnvelope className="quick-contact-icon" />
              <div>
                <p className="quick-contact-label">Email</p>
                <a href={`mailto:${emailTo}`} className="quick-contact-val text-link" style={{ color: 'var(--text-h)' }}>
                  {emailTo}
                </a>
              </div>
            </div>
            <button 
              className="btn-copy-action"
              onClick={() => handleCopy(emailTo, 'email')}
              title="Copy Email"
            >
              {copiedField === 'email' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
            </button>
          </div>

          {/* Phone Quick Cards with Copy */}
          {phones.map((phone, idx) => (
            <div key={phone} className="quick-contact-card">
              <div className="quick-contact-info">
                <FaPhoneAlt className="quick-contact-icon" />
                <div>
                  <p className="quick-contact-label">Phone {idx + 1}</p>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="quick-contact-val text-link" style={{ color: 'var(--text-h)' }}>
                    {phone}
                  </a>
                </div>
              </div>
              <button 
                className="btn-copy-action"
                onClick={() => handleCopy(phone, `phone-${idx}`)}
                title="Copy Phone"
              >
                {copiedField === `phone-${idx}` ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
              </button>
            </div>
          ))}

          <h3 className="card-title" style={{ marginTop: '28px', marginBottom: '14px', fontSize: '16px' }}>
            {contactSection?.labels?.social ?? 'Social Ecosystem'}
          </h3>
          <div className="social-pill-row">
            {contact?.github && (
              <a className="social-pill" href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
                <FaGithub />
              </a>
            )}
            {contact?.linkedin && (
              <a className="social-pill" href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
                <FaLinkedin />
              </a>
            )}
            {contact?.whatsapp && (
              <a className="social-pill" href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp">
                <FaWhatsapp />
              </a>
            )}
            {contact?.facebook && (
              <a className="social-pill" href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                <FaFacebook />
              </a>
            )}
            <a className="social-pill" href={`mailto:${emailTo}`} aria-label="Email" title="Direct Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <form className="card contact-form-modern" onSubmit={handleSubmit}>
          <h3 className="card-title" style={{ marginBottom: '8px', fontSize: '20px' }}>
            {contact?.form?.send ?? 'Send a Message'}
          </h3>
          <p className="muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
            I typically respond within 24 hours.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-name">
              {contact?.form?.name ?? 'Your Name'}
            </label>
            <input
              id="contact-name"
              className="modern-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-email">
              {contact?.form?.email ?? 'Your Email'}
            </label>
            <input
              id="contact-email"
              type="email"
              className="modern-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-message">
              {contact?.form?.message ?? 'Your Message'}
            </label>
            <textarea
              id="contact-message"
              className="modern-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project, goals, or inquiry..."
              rows={5}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={status === 'loading'}
            style={{ width: '100%', marginTop: '6px', borderRadius: '12px', padding: '14px' }}
          >
            {status === 'loading' ? (
              contact?.form?.sending ?? 'Sending Message...'
            ) : (
              <>
                <IoSend style={{ marginRight: '6px' }} />
                {contact?.form?.send ?? 'Send Message'}
              </>
            )}
          </button>

          {feedback && (
            <p
              className={`contact-note ${status === 'error' ? 'contact-note-error' : ''} ${
                status === 'success' ? 'contact-note-success' : ''
              }`}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${status === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                color: status === 'error' ? '#f87171' : 'var(--accent)',
                fontWeight: '600',
                fontSize: '14px',
                marginTop: '8px'
              }}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
