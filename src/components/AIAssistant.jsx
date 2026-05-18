import { useState, useEffect, useRef } from 'react'
import { FaRobot, FaTimes, FaPaperPlane, FaRegCommentDots } from 'react-icons/fa'

export default function AIAssistant({ portfolio, aiContent }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([{
    id: 1,
    text: aiContent?.initial ?? "Hi there!",
    sender: 'ai',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const generateResponse = (userText) => {
    const input = userText.toLowerCase()
    let response = aiContent?.fallback ?? "I'm still learning."
    let shouldClose = false

    if (input.includes('hello') || input.includes('hi') || input.includes('bonjour') || input.includes('salut')) {
      response = aiContent?.hello
    } else if (input.includes('thank') || input.includes('merci')) {
      response = aiContent?.thanks
    } else if (input.includes('bye') || input.includes('au revoir') || input.includes('close')) {
      response = aiContent?.bye
      shouldClose = true
    } else if (input.includes('project') || input.includes('build') || input.includes('projet')) {
      const list = portfolio.projects.map(p => p.title).join(', ')
      response = aiContent?.projects.replace('{list}', list)
    } else if (input.includes('skill') || input.includes('tech') || input.includes('compétence')) {
      const top = portfolio.skills[0].tags.slice(0, 3).join(', ')
      response = aiContent?.skills.replace('{top}', top)
    } else if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
      response = aiContent?.contact.replace('{email}', portfolio.contact.email)
    } else if (input.includes('who') || input.includes('about') || input.includes('qui')) {
      response = portfolio.profile.bio
    } else if (input.includes('education') || input.includes('study') || input.includes('étude')) {
      response = aiContent?.education.replace('{degree}', portfolio.education.degree).replace('{school}', portfolio.education.school)
    }

    return { text: response || aiContent?.fallback, shouldClose }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const { text, shouldClose } = generateResponse(inputValue)
      const aiMessage = {
        id: Date.now() + 1,
        text,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)

      if (shouldClose) {
        setTimeout(() => setIsOpen(false), 3000)
      }
    }, 1000)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-toggle-btn"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          color: '#000',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 255, 115, 0.4)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <FaTimes /> : <FaRegCommentDots />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window card" style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '350px',
          height: '500px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          animation: 'fadeInUp 0.4s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--accent)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaRobot fontSize="20px" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px', lineHeight: 1 }}>{aiContent?.name ?? 'EMEKSON AI'}</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>{aiContent?.status ?? 'Online'}</div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'var(--bg-subtle)'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg)',
                  color: msg.sender === 'user' ? '#000' : 'var(--text)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '9px', opacity: 0.5, marginTop: '4px' }}>{msg.time}</div>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '4px' }}>
                <div className="dot-typing" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '10px',
            backgroundColor: 'var(--bg-subtle)'
          }}>
            <input
              type="text"
              className="input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={aiContent?.placeholder ?? "Ask me anything..."}
              style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '13px' }}
            />
            <button type="submit" className="btn btn-primary" style={{
              width: '40px',
              height: '40px',
              padding: 0,
              borderRadius: '50%',
              flexShrink: 0
            }}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: var(--accent);
          color: var(--accent);
          box-shadow: 9984px 0 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px 0 0 0 var(--accent);
          animation: dotTyping 1.5s infinite linear;
        }

        @keyframes dotTyping {
          0% { box-shadow: 9984px 0 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px 0 0 0 var(--accent); }
          16.667% { box-shadow: 9984px -6px 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px 0 0 0 var(--accent); }
          33.333% { box-shadow: 9984px 0 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px 0 0 0 var(--accent); }
          50% { box-shadow: 9984px 0 0 0 var(--accent), 9996px -6px 0 0 var(--accent), 10008px 0 0 0 var(--accent); }
          66.667% { box-shadow: 9984px 0 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px 0 0 0 var(--accent); }
          83.333% { box-shadow: 9984px 0 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px -6px 0 0 var(--accent); }
          100% { box-shadow: 9984px 0 0 0 var(--accent), 9996px 0 0 0 var(--accent), 10008px 0 0 0 var(--accent); }
        }
      `}</style>
    </>
  )
}
