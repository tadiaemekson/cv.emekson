import { useState } from 'react'
import {
  FaGithub, FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope,
  FaPhoneAlt, FaCheck, FaCopy, FaCheckCircle, FaPaperPlane,
  FaClock, FaRedo
} from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'

export default function Contact({ contact, contactSection, lang = 'en' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const [copiedField, setCopiedField] = useState(null)
  const [lastSubmitted, setLastSubmitted] = useState({ name: '', email: '' })

  const emailTo = contact?.email ?? 'tadiaemekson@gmail.com'
  const phones = contact?.phones ?? ['+237 655 648 766', '+237 674 725 952']

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
        setLastSubmitted({ name: payload.name, email: payload.email })
        setStatus('success')
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
        setFeedback(
          lang === 'fr' 
            ? 'Serveur momentanément occupé, redirection vers votre application mail...' 
            : 'Server temporarily busy, opening your default email app...'
        )
        window.location.href = href
      })
  }

  const handleResetForm = () => {
    setStatus('idle')
    setFeedback('')
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Tadia! I just sent you a message from your portfolio.`
  )
  const whatsappUrl = contact?.whatsapp 
    ? `${contact.whatsapp}?text=${whatsappMessage}`
    : `https://wa.me/237655648766?text=${whatsappMessage}`

  return (
    <section id="contact" className="section contact-section">
      <div className="section-head">
        <p className="kicker">{contactSection?.kicker ?? 'Get in Touch'}</p>
        <h2 className="section-title">{contactSection?.title ?? "Let's Build Something Exceptional Together"}</h2>
        <p className="section-subtitle">
          {contactSection?.subtitle ?? 'Have an exciting project, internship opportunity, or question? Send a message or reach out directly.'}
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
                <p className="quick-contact-label">{contactSection?.labels?.email ?? 'Email'}</p>
                <a href={`mailto:${emailTo}`} className="quick-contact-val text-link" style={{ color: 'var(--text-h)' }}>
                  {emailTo}
                </a>
              </div>
            </div>
            <button 
              className="btn-copy-action"
              onClick={() => handleCopy(emailTo, 'email')}
              title={copiedField === 'email' ? (contactSection?.labels?.copied ?? 'Copied') : (contactSection?.labels?.copy ?? 'Copy')}
            >
              {copiedField === 'email' ? <><FaCheck /> {contactSection?.labels?.copied ?? 'Copied'}</> : <><FaCopy /> {contactSection?.labels?.copy ?? 'Copy'}</>}
            </button>
          </div>

          {/* Phone Quick Cards with Copy */}
          {phones.map((phone, idx) => (
            <div key={phone} className="quick-contact-card">
              <div className="quick-contact-info">
                <FaPhoneAlt className="quick-contact-icon" />
                <div>
                  <p className="quick-contact-label">{contactSection?.labels?.phone ?? 'Phone'} {idx + 1}</p>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="quick-contact-val text-link" style={{ color: 'var(--text-h)' }}>
                    {phone}
                  </a>
                </div>
              </div>
              <button 
                className="btn-copy-action"
                onClick={() => handleCopy(phone, `phone-${idx}`)}
                title={copiedField === `phone-${idx}` ? (contactSection?.labels?.copied ?? 'Copied') : (contactSection?.labels?.copy ?? 'Copy')}
              >
                {copiedField === `phone-${idx}` ? <><FaCheck /> {contactSection?.labels?.copied ?? 'Copied'}</> : <><FaCopy /> {contactSection?.labels?.copy ?? 'Copy'}</>}
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

        {/* Right Column: Dynamic Form or Celebration Thank You Card */}
        {status === 'success' ? (
          <div className="celebration-thankyou-card">
            <div className="celebration-icon-wrapper">
              <div className="celebration-ring"></div>
              <FaCheckCircle className="celebration-icon" />
            </div>

            <h3 className="celebration-title">
              {(contact?.celebration?.title ?? (lang === 'fr' ? 'Merci Beaucoup, {name} ! 🎉' : 'Thank You, {name}! 🎉'))
                .replace('{name}', lastSubmitted.name || (lang === 'fr' ? 'cher visiteur' : 'Friend'))}
            </h3>

            <p className="celebration-desc">
              {(contact?.celebration?.desc ?? (lang === 'fr' 
                ? 'Votre message a bien été transmis. Une notification a été envoyée et je vous répondrai à {email} très rapidement.' 
                : 'Your message has been delivered directly to my inbox. I will get back to you at {email} shortly.'))
                .replace('{email}', lastSubmitted.email || (lang === 'fr' ? 'votre adresse email' : 'your email'))}
            </p>

            <div className="celebration-info-box">
              <div className="celebration-info-item">
                <FaPaperPlane style={{ color: 'var(--accent)' }} />
                <span>
                  <strong>{contact?.celebration?.statusLabel ?? (lang === 'fr' ? 'Statut :' : 'Delivery Status:')}</strong>{' '}
                  {contact?.celebration?.statusValue ?? (lang === 'fr' ? 'Email transmis & Enregistré' : 'Email Dispatched & Stored')}
                </span>
              </div>
              <div className="celebration-info-item">
                <FaClock style={{ color: 'var(--accent-cyan)' }} />
                <span>
                  <strong>{contact?.celebration?.timeLabel ?? (lang === 'fr' ? 'Délai de réponse estimé :' : 'Estimated Response Time:')}</strong>{' '}
                  {contact?.celebration?.timeValue ?? (lang === 'fr' ? 'Sous 12 à 24 Heures' : 'Within 12 – 24 Hours')}
                </span>
              </div>
            </div>

            <div className="celebration-actions">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="celebration-whatsapp-btn"
              >
                <FaWhatsapp fontSize="18px" />
                {contact?.celebration?.whatsappBtn ?? (lang === 'fr' ? 'Échange direct sur WhatsApp' : 'Quick Chat on WhatsApp')}
              </a>

              <button 
                onClick={handleResetForm}
                className="btn btn-secondary"
                style={{ borderRadius: '999px', padding: '12px 22px', fontSize: '14px' }}
              >
                <FaRedo style={{ marginRight: '6px' }} />
                {contact?.celebration?.resetBtn ?? (lang === 'fr' ? 'Envoyer un autre message' : 'Send Another Message')}
              </button>
            </div>
          </div>
        ) : (
          <form className="card contact-form-modern" onSubmit={handleSubmit}>
            <h3 className="card-title" style={{ marginBottom: '8px', fontSize: '20px' }}>
              {contact?.form?.title ?? (lang === 'fr' ? 'Envoyer un Message' : 'Send a Message')}
            </h3>
            <p className="muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
              {contact?.form?.subtitle ?? (lang === 'fr' ? 'Je réponds généralement sous 24 heures.' : 'I typically respond within 24 hours.')}
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">
                {contact?.form?.name ?? (lang === 'fr' ? 'Votre Nom' : 'Your Name')}
              </label>
              <input
                id="contact-name"
                className="modern-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={contact?.form?.namePlaceholder ?? (lang === 'fr' ? 'Ex. Jean Dupont' : 'e.g. Alex Johnson')}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">
                {contact?.form?.email ?? (lang === 'fr' ? 'Votre Email' : 'Your Email')}
              </label>
              <input
                id="contact-email"
                type="email"
                className="modern-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={contact?.form?.emailPlaceholder ?? (lang === 'fr' ? 'Ex. jean@societe.com' : 'e.g. alex@company.com')}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">
                {contact?.form?.message ?? (lang === 'fr' ? 'Votre Message' : 'Your Message')}
              </label>
              <textarea
                id="contact-message"
                className="modern-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={contact?.form?.messagePlaceholder ?? (lang === 'fr' ? 'Décrivez votre projet, opportunité ou question...' : 'Tell me about your project, goals, or inquiry...')}
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
                contact?.form?.sending ?? (lang === 'fr' ? 'Envoi en cours...' : 'Sending Message...')
              ) : (
                <>
                  <IoSend style={{ marginRight: '6px' }} />
                  {contact?.form?.send ?? (lang === 'fr' ? 'Envoyer le Message' : 'Send Message')}
                </>
              )}
            </button>

            {feedback && (
              <p
                className="contact-note contact-note-error"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
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
        )}
      </div>
    </section>
  )
}
