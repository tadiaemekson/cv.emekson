import { useState, useEffect, useRef } from 'react'
import { 
  FaTimes, FaTrashAlt, FaRobot, FaMagic, 
  FaExternalLinkAlt 
} from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import logoImg from '../assets/logo.png'
import { queryAIAgent } from '../utils/aiKnowledgeAgent'
import { portfolio as defaultPortfolio } from '../data/portfolio'

// Lightweight inline markdown formatter for rich chat bubbles
function FormattedMessage({ text }) {
  if (!text) return null

  // Split lines
  const lines = text.split('\n')

  return (
    <div className="ai-formatted-content">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} style={{ height: '8px' }} />
        }

        // Bullet point detection
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-')
        const cleanLine = isBullet ? line.trim().substring(1).trim() : line

        // Parse markdown formatting: **bold**, `code`, [link](url)
        const parts = []
        let keyCounter = 0

        // Regex for markdown components
        const regex = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g
        let lastIndex = 0
        let match

        while ((match = regex.exec(cleanLine)) !== null) {
          // Push text before match
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index))
          }

          if (match[1]) {
            // **bold**
            parts.push(<strong key={keyCounter++} style={{ color: 'var(--text-h)', fontWeight: '700' }}>{match[2]}</strong>)
          } else if (match[3]) {
            // `code`
            parts.push(
              <code key={keyCounter++} style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.9em',
                fontFamily: 'monospace'
              }}>
                {match[4]}
              </code>
            )
          } else if (match[5]) {
            // [text](url)
            const linkText = match[6]
            const linkUrl = match[7]
            const isExternal = linkUrl.startsWith('http') || linkUrl.startsWith('mailto:') || linkUrl.startsWith('tel:')

            parts.push(
              <a 
                key={keyCounter++} 
                href={linkUrl} 
                target={isExternal ? '_blank' : '_self'} 
                rel="noreferrer"
                style={{
                  color: 'var(--accent-cyan)',
                  textDecoration: 'underline',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                {linkText}
                {isExternal && <FaExternalLinkAlt style={{ fontSize: '9px' }} />}
              </a>
            )
          }

          lastIndex = regex.lastIndex
        }

        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex))
        }

        if (isBullet) {
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
              <span style={{ flex: 1 }}>{parts}</span>
            </div>
          )
        }

        return <p key={idx} style={{ margin: '0 0 6px 0' }}>{parts}</p>
      })}
    </div>
  )
}

function formatCurrentTime() {
  if (typeof window === 'undefined') return '12:00'
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AIAssistant({ aiContent, portfolioData, lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false)
  const isFR = lang === 'fr'
  const fullData = portfolioData || defaultPortfolio
  const msgIdCounter = useRef(100)

  const initialGreeting = isFR
    ? `Bonjour ! 👋 Je suis le guide interactif du portfolio de **TADIA FONGE EMEKSON**.\n\nPosez-moi vos questions sur ses projets réels (ExchangeCompare, PartoCare), ses compétences techniques (React 19, Laravel 12, Node.js), son stage chez **IFP PRONOTE** ou ses coordonnées.`
    : `Hello! 👋 I am the interactive portfolio guide for **TADIA FONGE EMEKSON**.\n\nFeel free to ask me anything about his real-world projects (ExchangeCompare, PartoCare), his core tech stack (React 19, Laravel 12, Node.js), his internship at **IFP PRONOTE**, or his contact details.`

  const defaultSuggestions = isFR ? [
    '🚀 Projets d’ingénierie majeurs',
    '💼 Stage chez IFP PRONOTE',
    '🛠️ Stack technique & Compétences',
    '📞 Comment contacter Emekson ?',
    '📄 Comment télécharger son CV ?'
  ] : [
    '🚀 Major engineering projects',
    '💼 Internship at IFP PRONOTE',
    '🛠️ Technical skills & stack',
    '📞 How to contact Emekson?',
    '📄 How to download his resume?'
  ]

  const [messages, setMessages] = useState(() => [{
    id: 1,
    text: initialGreeting,
    sender: 'ai',
    time: formatCurrentTime(),
    suggestions: defaultSuggestions
  }])

  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [isOpen])

  const toggleOpen = () => {
    setIsOpen(prev => {
      const next = !prev
      if (next) setUnreadCount(0)
      return next
    })
  }

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim()
    if (!text) return

    msgIdCounter.current += 1
    const userMessage = {
      id: msgIdCounter.current,
      text,
      sender: 'user',
      time: formatCurrentTime()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // AI Reasoning & Processing with natural slight delay
    setTimeout(() => {
      const result = queryAIAgent(text, fullData, lang)
      msgIdCounter.current += 1

      const aiMessage = {
        id: msgIdCounter.current,
        text: result?.text || (isFR ? "Je reste à votre disposition. Que souhaitez-vous savoir d'autre ?" : "I'm here to help. What else would you like to know?"),
        sender: 'ai',
        time: formatCurrentTime(),
        suggestions: result?.suggestions || defaultSuggestions
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)

      if (!isOpen) {
        setUnreadCount(c => c + 1)
      }

      if (result?.shouldClose) {
        setTimeout(() => setIsOpen(false), 3200)
      }
    }, 600)
  }

  const handleClearChat = () => {
    msgIdCounter.current += 1
    setMessages([{
      id: msgIdCounter.current,
      text: initialGreeting,
      sender: 'ai',
      time: formatCurrentTime(),
      suggestions: defaultSuggestions
    }])
  }

  return (
    <>
      {/* Floating Toggle Button with Glowing Badge */}
      <button
        onClick={toggleOpen}
        className="ai-toggle-btn"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid var(--accent)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.45)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        aria-label={isFR ? "Ouvrir l'assistant IA" : "Open AI Assistant"}
        title={isFR ? "Discuter avec l'assistant IA d'Emekson" : "Chat with Emekson's AI Assistant"}
      >
        {isOpen ? (
          <FaTimes style={{ color: 'var(--accent)', fontSize: '22px' }} />
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={logoImg} 
              alt="AI Assistant" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '800',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)'
              }}>
                {unreadCount}
              </span>
            )}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: '2px solid #030706'
            }} />
          </div>
        )}
      </button>

      {/* Modern AI Chat Window */}
      {isOpen && (
        <div 
          className="ai-chat-window card" 
          style={{
            position: 'fixed',
            bottom: '98px',
            right: '24px',
            width: '400px',
            maxWidth: 'calc(100vw - 36px)',
            height: '560px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid var(--accent-border)',
            background: 'rgba(9, 14, 18, 0.94)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 32px rgba(16, 185, 129, 0.15)',
            animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={logoImg} 
                  alt="AI Assistant Logo" 
                  style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--accent-border)' }} 
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  border: '2px solid #030706'
                }} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {aiContent?.name ?? (isFR ? "Guide Portfolio" : "Portfolio Guide")}
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '999px', background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontWeight: '700' }}>
                    GUIDE
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaMagic style={{ fontSize: '9px' }} />
                  {isFR ? 'Assistant Interactif' : 'Interactive Portfolio Guide'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleClearChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title={isFR ? 'Effacer la conversation' : 'Clear conversation'}
                aria-label="Clear chat"
              >
                <FaTrashAlt style={{ fontSize: '13px' }} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Close Chat"
              >
                <FaTimes style={{ fontSize: '16px' }} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'transparent'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.04)',
                  color: msg.sender === 'user' ? '#030706' : 'var(--text)',
                  fontSize: '13.5px',
                  lineHeight: '1.6',
                  fontWeight: msg.sender === 'user' ? '600' : '400',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.sender === 'user' ? (
                    msg.text
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}
                </div>

                <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px', color: 'var(--text)', padding: '0 4px' }}>
                  {msg.time}
                </div>

                {/* Contextual Suggestion Prompt Chips */}
                {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '10px',
                    paddingLeft: '2px'
                  }}>
                    {msg.suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(suggestion.replace(/^[^\w\s]+/, '').trim())}
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          color: 'var(--text-h)',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'
                          e.currentTarget.style.borderColor = 'var(--accent)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'
                          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.25)'
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '16px 16px 16px 4px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <FaRobot style={{ color: 'var(--accent)', fontSize: '13px' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isFR ? 'Emekson AI réfléchit...' : 'Emekson AI is thinking...'}
                </span>
                <div className="dot-typing" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }} 
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(9, 14, 18, 0.98)'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="modern-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={isFR ? "Posez une question sur ses projets, son parcours..." : "Ask about projects, stack, experience, contact..."}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!inputValue.trim() || isTyping}
              style={{
                width: '42px',
                height: '42px',
                padding: 0,
                borderRadius: '12px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (!inputValue.trim() || isTyping) ? 0.5 : 1,
                cursor: (!inputValue.trim() || isTyping) ? 'not-allowed' : 'pointer'
              }} 
              aria-label={isFR ? "Envoyer le message" : "Send message"}
            >
              <IoSend fontSize="15px" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 5px;
          height: 5px;
          border-radius: 5px;
          background-color: var(--accent);
          color: var(--accent);
          box-shadow: 9984px 0 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px 0 0 0 var(--accent);
          animation: dotTyping 1.4s infinite linear;
        }

        @keyframes dotTyping {
          0% { box-shadow: 9984px 0 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px 0 0 0 var(--accent); }
          16.667% { box-shadow: 9984px -5px 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px 0 0 0 var(--accent); }
          33.333% { box-shadow: 9984px 0 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px 0 0 0 var(--accent); }
          50% { box-shadow: 9984px 0 0 0 var(--accent), 9994px -5px 0 0 var(--accent), 10004px 0 0 0 var(--accent); }
          66.667% { box-shadow: 9984px 0 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px 0 0 0 var(--accent); }
          83.333% { box-shadow: 9984px 0 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px -5px 0 0 var(--accent); }
          100% { box-shadow: 9984px 0 0 0 var(--accent), 9994px 0 0 0 var(--accent), 10004px 0 0 0 var(--accent); }
        }
      `}</style>
    </>
  )
}
