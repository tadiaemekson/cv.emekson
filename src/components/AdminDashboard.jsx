import { useState, useEffect, useCallback } from 'react'
import {
  FaUser, FaProjectDiagram, FaTools, FaGraduationCap, FaEnvelope,
  FaSignOutAlt, FaSave, FaTrash, FaPlus, FaExternalLinkAlt, FaSync,
  FaCheckCircle, FaSearch, FaArrowLeft, FaEye, FaDownload, FaUpload,
  FaUndo, FaClock, FaLayerGroup, FaChevronRight
} from 'react-icons/fa'
import logoImg from '../assets/logo.png'
import { portfolio as defaultPortfolio } from '../data/portfolio'

export default function AdminDashboard({ token, onLogout, initialPortfolio, onPortfolioUpdate }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [portfolioData, setPortfolioData] = useState(() => {
    return initialPortfolio || defaultPortfolio
  })
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [editingLang, setEditingLang] = useState('en')

  // Project Modal State
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [editingProjectIndex, setEditingProjectIndex] = useState(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    details: '',
    tech: '',
    github: '',
    demo: '',
  })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Load Messages
  const loadMessages = useCallback(async () => {
    setLoadingMessages(true)
    try {
      const res = await fetch('/api/messages', {
        headers: { 'X-Admin-Secret': token }
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(Array.isArray(data?.messages) ? data.messages : [])
      }
    } catch {
      showToast('Failed to load messages from server', 'error')
    } finally {
      setLoadingMessages(false)
    }
  }, [token])

  // Load dynamic portfolio from server
  const loadServerPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) {
        const data = await res.json()
        if (data?.portfolio) {
          setPortfolioData(data.portfolio)
          if (onPortfolioUpdate) onPortfolioUpdate(data.portfolio)
        }
      }
    } catch {
      console.warn('Could not load portfolio from server')
    }
  }, [onPortfolioUpdate])

  useEffect(() => {
    loadMessages()
    loadServerPortfolio()
  }, [loadMessages, loadServerPortfolio])

  // Save Portfolio to Server
  const savePortfolioToServer = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': token
        },
        body: JSON.stringify({ portfolio: portfolioData })
      })
      if (res.ok) {
        showToast('Portfolio changes saved and synced successfully!')
        if (onPortfolioUpdate) onPortfolioUpdate(portfolioData)
        window.localStorage.setItem('portfolio-custom-data', JSON.stringify(portfolioData))
      } else {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Save failed')
      }
    } catch (e) {
      showToast(`Error saving: ${e.message}`, 'error')
      // Save locally as backup
      window.localStorage.setItem('portfolio-custom-data', JSON.stringify(portfolioData))
      if (onPortfolioUpdate) onPortfolioUpdate(portfolioData)
    } finally {
      setSaving(false)
    }
  }

  // Delete message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try {
      const res = await fetch('/api/messages/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': token
        },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id))
        if (selectedMessage?.id === id) setSelectedMessage(null)
        showToast('Message deleted.')
      }
    } catch {
      showToast('Failed to delete message', 'error')
    }
  }

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolioData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Backup downloaded!')
  }

  // Import JSON backup
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (parsed?.en && parsed?.fr) {
          setPortfolioData(parsed)
          showToast('Portfolio imported! Click Save to apply changes.')
        } else {
          showToast('Invalid portfolio backup format.', 'error')
        }
      } catch {
        showToast('Failed to parse JSON file.', 'error')
      }
    }
    reader.readAsText(file)
  }

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset all portfolio data to factory defaults? Any unsaved edits will be lost.')) {
      setPortfolioData(defaultPortfolio)
      showToast('Reset to default content. Remember to Save.')
    }
  }

  // Active language portfolio content reference
  const cur = portfolioData[editingLang] || portfolioData.en

  // Helper updater for nested properties
  const updateCur = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [editingLang]: {
        ...prev[editingLang],
        [field]: value
      }
    }))
  }

  const updateProfile = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [editingLang]: {
        ...prev[editingLang],
        profile: {
          ...prev[editingLang].profile,
          [field]: value
        }
      }
    }))
  }

  // Project Handlers
  const handleOpenProjectModal = (index = null) => {
    if (index !== null) {
      const p = cur.projects[index]
      setProjectForm({
        title: p.title || '',
        description: p.description || '',
        details: p.details || '',
        tech: (p.tech || []).join(', '),
        github: p.github || '',
        demo: p.demo || '',
      })
      setEditingProjectIndex(index)
    } else {
      setProjectForm({
        title: '',
        description: '',
        details: '',
        tech: 'React, Node.js, TypeScript',
        github: 'https://github.com/tadiaemekson/',
        demo: '',
      })
      setEditingProjectIndex(null)
    }
    setProjectModalOpen(true)
  }

  const handleSaveProject = (e) => {
    e.preventDefault()
    const techArray = projectForm.tech
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const updatedProject = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      details: projectForm.details.trim(),
      tech: techArray,
      github: projectForm.github.trim(),
      ...(projectForm.demo.trim() ? { demo: projectForm.demo.trim() } : {}),
    }

    const newProjects = [...(cur.projects || [])]
    if (editingProjectIndex !== null) {
      newProjects[editingProjectIndex] = updatedProject
    } else {
      newProjects.unshift(updatedProject)
    }

    updateCur('projects', newProjects)
    setProjectModalOpen(false)
    showToast(editingProjectIndex !== null ? 'Project updated!' : 'New project added!')
  }

  const handleDeleteProject = (index) => {
    if (window.confirm(`Delete project "${cur.projects[index].title}"?`)) {
      const newProjects = cur.projects.filter((_, i) => i !== index)
      updateCur('projects', newProjects)
      showToast('Project removed.')
    }
  }

  // Filter messages
  const filteredMessages = messages.filter(m => {
    const q = searchTerm.toLowerCase()
    return (m.name || '').toLowerCase().includes(q) ||
           (m.email || '').toLowerCase().includes(q) ||
           (m.message || '').toLowerCase().includes(q)
  })

  return (
    <div className="admin-container" style={{ minHeight: '100vh', padding: '24px 16px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '14px 24px',
          borderRadius: '12px',
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#fff',
          fontWeight: '700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaCheckCircle /> {toast.msg}
        </div>
      )}

      {/* Header Bar */}
      <header className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={logoImg} alt="Logo" style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid var(--accent-border)' }} />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-h)' }}>
              EMEKSON Control Center
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}></span>
              Admin Session Active
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Language Switcher for Editing */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '999px', display: 'flex', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setEditingLang('en')}
              style={{
                background: editingLang === 'en' ? 'var(--accent)' : 'transparent',
                color: editingLang === 'en' ? '#000' : 'var(--text)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setEditingLang('fr')}
              style={{
                background: editingLang === 'fr' ? 'var(--accent)' : 'transparent',
                color: editingLang === 'fr' ? '#000' : 'var(--text)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🇫🇷 Français
            </button>
          </div>

          <button
            onClick={savePortfolioToServer}
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '8px 20px', borderRadius: '999px', fontSize: '13px' }}
          >
            <FaSave /> {saving ? 'Saving...' : 'Save & Publish'}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '13px' }}
            title="Open Live Portfolio in new tab"
          >
            <FaEye /> View Live
          </a>

          <button
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '13px', color: '#f87171' }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <FaLayerGroup /> },
          { id: 'messages', label: `Messages (${messages.length})`, icon: <FaEnvelope /> },
          { id: 'profile', label: 'Profile & Bio', icon: <FaUser /> },
          { id: 'projects', label: `Projects (${(cur.projects || []).length})`, icon: <FaProjectDiagram /> },
          { id: 'skills', label: 'Skills & Arsenal', icon: <FaTools /> },
          { id: 'education', label: 'Experience & Degrees', icon: <FaGraduationCap /> },
          { id: 'contact', label: 'Contact & Socials', icon: <FaEnvelope /> },
          { id: 'backup', label: 'Backup & Reset', icon: <FaDownload /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: activeTab === tab.id ? 'var(--accent)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? '#030706' : 'var(--text-h)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--accent)' : 'var(--border)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                <FaEnvelope />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-h)' }}>{messages.length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Messages Received</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                <FaProjectDiagram />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-h)' }}>{(cur.projects || []).length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Portfolio Projects</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                <FaTools />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-h)' }}>{(cur.skills || []).length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Skill Categories</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                <FaGraduationCap />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-h)' }}>{(cur.experience || []).length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Work & Internships</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={() => { setActiveTab('projects'); handleOpenProjectModal(); }} className="btn btn-primary" style={{ borderRadius: '999px', fontSize: '13px' }}>
                <FaPlus /> Add New Project
              </button>
              <button onClick={() => setActiveTab('messages')} className="btn btn-secondary" style={{ borderRadius: '999px', fontSize: '13px' }}>
                <FaEnvelope /> View Inbox ({messages.length})
              </button>
              <button onClick={() => setActiveTab('profile')} className="btn btn-secondary" style={{ borderRadius: '999px', fontSize: '13px' }}>
                <FaUser /> Edit Bio & Tagline
              </button>
              <button onClick={savePortfolioToServer} className="btn btn-secondary" style={{ borderRadius: '999px', fontSize: '13px', color: 'var(--accent)' }}>
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MESSAGES INBOX */}
      {activeTab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
              <FaSearch style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="modern-input"
                style={{ paddingLeft: '38px', borderRadius: '999px', fontSize: '13px' }}
              />
            </div>

            <button onClick={loadMessages} disabled={loadingMessages} className="btn btn-secondary" style={{ borderRadius: '999px', fontSize: '13px' }}>
              <FaSync className={loadingMessages ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {loadingMessages && <p className="muted">Loading messages...</p>}

          {!loadingMessages && filteredMessages.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <FaEnvelope style={{ fontSize: '36px', color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-h)', fontWeight: '700' }}>No messages found.</p>
              <p className="muted" style={{ fontSize: '13px' }}>Submissions from the contact form will show up here.</p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '14px' }}>
            {filteredMessages.map((item) => (
              <div key={item.id} className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-h)', fontSize: '16px' }}>{item.name}</span>
                    <a href={`mailto:${item.email}`} className="text-link" style={{ fontSize: '13px' }}>
                      {item.email}
                    </a>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {item.message}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaClock /> {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`mailto:${item.email}?subject=Re:%20Portfolio%20Inquiry`} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px' }}>
                    Reply
                  </a>
                  <button onClick={() => handleDeleteMessage(item.id)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px', color: '#f87171' }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE & BIO */}
      {activeTab === 'profile' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>👤 Profile & Bio Information ({editingLang.toUpperCase()})</h3>
            <span className="tag-pill" style={{ color: 'var(--accent)' }}>Editing {editingLang === 'en' ? 'English' : 'French'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="modern-input"
                value={cur.profile?.name || ''}
                onChange={e => updateProfile('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="modern-input"
                value={cur.profile?.location || ''}
                onChange={e => updateProfile('location', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Role / Title</label>
            <input
              className="modern-input"
              value={cur.profile?.role || ''}
              onChange={e => updateProfile('role', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Tagline</label>
            <input
              className="modern-input"
              value={cur.hero?.tagline || ''}
              onChange={e => updateCur('hero', { ...cur.hero, tagline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Biography</label>
            <textarea
              className="modern-textarea"
              rows={6}
              value={cur.about?.bio || ''}
              onChange={e => updateCur('about', { ...cur.about, bio: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Focus / Extra Story</label>
            <textarea
              className="modern-textarea"
              rows={3}
              value={cur.about?.extra || ''}
              onChange={e => updateCur('about', { ...cur.about, extra: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Years Stat</label>
              <input
                className="modern-input"
                value={cur.profile?.stats?.years || '3+'}
                onChange={e => updateProfile('stats', { ...cur.profile?.stats, years: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Projects Stat</label>
              <input
                className="modern-input"
                value={cur.profile?.stats?.projects || '8+'}
                onChange={e => updateProfile('stats', { ...cur.profile?.stats, projects: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Skills Stat</label>
              <input
                className="modern-input"
                value={cur.profile?.stats?.skills || '12+'}
                onChange={e => updateProfile('stats', { ...cur.profile?.stats, skills: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROJECTS MANAGER */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0 }}>🚀 Projects Manager ({editingLang.toUpperCase()})</h3>
              <p className="muted" style={{ fontSize: '13px' }}>Add, edit, or reorder your portfolio projects.</p>
            </div>
            <button onClick={() => handleOpenProjectModal()} className="btn btn-primary" style={{ borderRadius: '999px', fontSize: '13px' }}>
              <FaPlus /> Add New Project
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {(cur.projects || []).map((project, idx) => (
              <div key={idx} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-h)', fontSize: '16px' }}>{project.title}</span>
                  </div>
                  <p className="muted" style={{ fontSize: '13px', marginBottom: '10px' }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(project.tech || []).map(t => (
                      <span key={t} className="tag-pill" style={{ fontSize: '11px' }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenProjectModal(idx)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProject(idx)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px', color: '#f87171' }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SKILLS ARSENAL */}
      {activeTab === 'skills' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>🛠️ Skills & Technologies ({editingLang.toUpperCase()})</h3>
            <button
              onClick={() => {
                const title = prompt('Enter new Skill Category name:')
                if (title) {
                  updateCur('skills', [...(cur.skills || []), { title, tags: ['Sample Tool'] }])
                }
              }}
              className="btn btn-secondary"
              style={{ borderRadius: '999px', fontSize: '12px', padding: '6px 16px' }}
            >
              <FaPlus /> Add Category
            </button>
          </div>

          {(cur.skills || []).map((cat, catIdx) => (
            <div key={catIdx} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <input
                  className="modern-input"
                  style={{ fontWeight: '700', fontSize: '15px', maxWidth: '300px' }}
                  value={cat.title}
                  onChange={e => {
                    const newSkills = [...cur.skills]
                    newSkills[catIdx].title = e.target.value
                    updateCur('skills', newSkills)
                  }}
                />
                <button
                  onClick={() => {
                    if (window.confirm(`Delete category "${cat.title}"?`)) {
                      updateCur('skills', cur.skills.filter((_, i) => i !== catIdx))
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ color: '#f87171', fontSize: '12px', padding: '4px 10px' }}
                >
                  <FaTrash />
                </button>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px' }}>Tech Tags (Comma-separated)</label>
                <input
                  className="modern-input"
                  value={(cat.tags || []).join(', ')}
                  onChange={e => {
                    const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    const newSkills = [...cur.skills]
                    newSkills[catIdx].tags = tagsArray
                    updateCur('skills', newSkills)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: EXPERIENCE & EDUCATION */}
      {activeTab === 'education' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Education Degree */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>🎓 Current / Main Education Degree</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Degree</label>
                <input
                  className="modern-input"
                  value={cur.education?.degree || ''}
                  onChange={e => updateCur('education', { ...cur.education, degree: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Period</label>
                <input
                  className="modern-input"
                  value={cur.education?.period || ''}
                  onChange={e => updateCur('education', { ...cur.education, period: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">School</label>
              <input
                className="modern-input"
                value={cur.education?.school || ''}
                onChange={e => updateCur('education', { ...cur.education, school: e.target.value })}
              />
            </div>
          </div>

          {/* Work & Internships */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>💼 Professional Experience & Internships</h3>
              <button
                onClick={() => {
                  const newExp = {
                    title: 'New Position',
                    company: 'Company Name',
                    location: 'City, Country',
                    period: '2026 – Present',
                    details: ['Key accomplishment or duty.']
                  }
                  updateCur('experience', [newExp, ...(cur.experience || [])])
                }}
                className="btn btn-secondary"
                style={{ borderRadius: '999px', fontSize: '12px', padding: '6px 14px' }}
              >
                <FaPlus /> Add Position
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {(cur.experience || []).map((exp, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <input
                      className="modern-input"
                      placeholder="Title"
                      value={exp.title}
                      onChange={e => {
                        const next = [...cur.experience]
                        next[idx].title = e.target.value
                        updateCur('experience', next)
                      }}
                    />
                    <input
                      className="modern-input"
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => {
                        const next = [...cur.experience]
                        next[idx].company = e.target.value
                        updateCur('experience', next)
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <input
                      className="modern-input"
                      placeholder="Period (e.g. 2026 – Present)"
                      value={exp.period}
                      onChange={e => {
                        const next = [...cur.experience]
                        next[idx].period = e.target.value
                        updateCur('experience', next)
                      }}
                    />
                    <input
                      className="modern-input"
                      placeholder="Location"
                      value={exp.location}
                      onChange={e => {
                        const next = [...cur.experience]
                        next[idx].location = e.target.value
                        updateCur('experience', next)
                      }}
                    />
                  </div>
                  <textarea
                    className="modern-textarea"
                    rows={2}
                    placeholder="Details bullet point"
                    value={(exp.details || []).join('\n')}
                    onChange={e => {
                      const next = [...cur.experience]
                      next[idx].details = e.target.value.split('\n').filter(Boolean)
                      updateCur('experience', next)
                    }}
                  />
                  <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <button
                      onClick={() => updateCur('experience', cur.experience.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Delete position
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CONTACT & SOCIALS */}
      {activeTab === 'contact' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: 0 }}>📞 Contact Information & Social Links</h3>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="modern-input"
              value={cur.contact?.email || ''}
              onChange={e => updateCur('contact', { ...cur.contact, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Numbers (Comma-separated)</label>
            <input
              className="modern-input"
              value={(cur.contact?.phones || []).join(', ')}
              onChange={e => {
                const phones = e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                updateCur('contact', { ...cur.contact, phones })
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                className="modern-input"
                value={cur.contact?.github || ''}
                onChange={e => updateCur('contact', { ...cur.contact, github: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                className="modern-input"
                value={cur.contact?.linkedin || ''}
                onChange={e => updateCur('contact', { ...cur.contact, linkedin: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp URL</label>
              <input
                className="modern-input"
                value={cur.contact?.whatsapp || ''}
                onChange={e => updateCur('contact', { ...cur.contact, whatsapp: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook URL</label>
              <input
                className="modern-input"
                value={cur.contact?.facebook || ''}
                onChange={e => updateCur('contact', { ...cur.contact, facebook: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: BACKUP & RESET */}
      {activeTab === 'backup' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: 0 }}>💾 Backup, Export & Factory Reset</h3>
          <p className="muted">Export complete JSON snapshots of your portfolio or restore anytime.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <button onClick={handleExportJSON} className="btn btn-primary" style={{ borderRadius: '999px' }}>
              <FaDownload /> Download JSON Backup
            </button>

            <label className="btn btn-secondary" style={{ borderRadius: '999px', cursor: 'pointer' }}>
              <FaUpload /> Import JSON Backup
              <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
            </label>

            <button onClick={handleResetToDefault} className="btn btn-secondary" style={{ borderRadius: '999px', color: '#f87171' }}>
              <FaUndo /> Reset to Factory Defaults
            </button>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {projectModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form onSubmit={handleSaveProject} className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>
              {editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'} ({editingLang.toUpperCase()})
            </h3>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Project Title *</label>
              <input
                className="modern-input"
                required
                value={projectForm.title}
                onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. AI Financial Dashboard"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Short Tagline Description *</label>
              <input
                className="modern-input"
                required
                value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Short summary displayed on the card"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Detailed Case Study / Architecture</label>
              <textarea
                className="modern-textarea"
                rows={4}
                value={projectForm.details}
                onChange={e => setProjectForm({ ...projectForm, details: e.target.value })}
                placeholder="Comprehensive technical breakdown shown in the details modal..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Tech Stack Tags (Comma-separated) *</label>
              <input
                className="modern-input"
                required
                value={projectForm.tech}
                onChange={e => setProjectForm({ ...projectForm, tech: e.target.value })}
                placeholder="React, TypeScript, Tailwind CSS, Supabase"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">GitHub Repository URL</label>
                <input
                  className="modern-input"
                  value={projectForm.github}
                  onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Live Demo URL (Optional)</label>
                <input
                  className="modern-input"
                  value={projectForm.demo}
                  onChange={e => setProjectForm({ ...projectForm, demo: e.target.value })}
                  placeholder="https://my-app.vercel.app"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setProjectModalOpen(false)} className="btn btn-secondary" style={{ borderRadius: '999px' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '999px' }}>
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
