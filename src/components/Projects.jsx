import { useEffect, useState } from 'react'
import { FaGithub, FaStar, FaCodeBranch, FaLayerGroup, FaRocket, FaHeartbeat, FaCode, FaRobot, FaBrain } from 'react-icons/fa'
import { SiLaravel, SiReact, SiNodedotjs, SiPhp } from 'react-icons/si'
import ProjectModal from './ProjectModal'

const projectHeaderIcons = {
  'EMEKSON AI — Conversational Reasoning Agent': <FaRobot style={{ color: 'var(--accent-bright)' }} />,
  'EMEKSON AI — Agent de Raisonnement Conversationnel': <FaRobot style={{ color: 'var(--accent-bright)' }} />,
  'ExchangeCompare Africa': <SiLaravel />,
  'PartoCare': <FaHeartbeat />,
  'Gourmet Restaurant Platform': <SiReact />,
  'Plateforme de Restauration Gourmet': <SiReact />,
  'Premium Personal Portfolio & 3D Showcase': <FaRocket />,
  'Portfolio Personnel Premium & Vitrine 3D': <FaRocket />,
  'Premium Personal Portfolio': <FaRocket />,
  'Clinic Management System': <SiPhp />,
  'Système de Gestion de Clinique': <SiPhp />,
  'B-TECH Academic Project': <FaCode />,
  'Projet Académique B-TECH': <FaCode />,
  'Node.js Practice Server': <SiNodedotjs />,
  "Serveur d'Entraînement Node.js": <SiNodedotjs />,
}

function ProjectCard({ project, onClick, projectsSection }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (project.github && project.github.includes('github.com')) {
      const match = project.github.match(/github\.com\/([^/]+)\/([^/.]+)/)
      if (match) {
        const [, owner, repo] = match
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.stargazers_count !== undefined) {
              setStats({
                stars: data.stargazers_count,
                forks: data.forks_count,
              })
            }
          })
          .catch(() => {})
      }
    }
  }, [project.github])

  const icon = projectHeaderIcons[project.title] || (project.title.toLowerCase().includes('ai') ? <FaRobot /> : <FaRocket />)

  return (
    <article className="card project-card-modern" onClick={onClick}>
      <div className="project-card-banner">
        <div className="project-badge-icon">
          {icon}
        </div>
        {stats && (stats.stars > 0 || stats.forks > 0) && (
          <div style={{ display: 'flex', gap: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>
            {stats.stars > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FaStar /> {stats.stars}
              </span>
            )}
            {stats.forks > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FaCodeBranch /> {stats.forks}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="project-card-body">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-desc">{project.description}</p>

        <div className="project-tag-row">
          {(project.tech ?? []).slice(0, 5).map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
          {(project.tech ?? []).length > 5 && (
            <span className="tag-pill" style={{ color: 'var(--accent)' }}>
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        <div className="project-card-footer" onClick={(e) => e.stopPropagation()}>
          <button className="project-btn-details" onClick={onClick}>
            {projectsSection?.details ?? 'Explore Details'} →
          </button>
          {project.github && (
            <a 
              className="project-btn-github" 
              href={project.github} 
              target="_blank" 
              rel="noreferrer" 
              title="GitHub Repository"
            >
              <FaGithub /> {projectsSection?.source ?? 'Code'}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects({ projects, projectsSection, ui }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  const filterLabels = {
    all: projectsSection?.filters?.all ?? 'All Projects',
    ai: projectsSection?.filters?.ai ?? 'AI & SaaS Systems',
    health: projectsSection?.filters?.health ?? 'HealthTech & Systems',
    fullstack: projectsSection?.filters?.fullstack ?? 'Full-Stack Stack'
  }

  const filteredProjects = (projects ?? []).filter((p) => {
    if (activeFilter === 'all') return true
    const title = p.title.toLowerCase()
    const desc = (p.description + (p.details || '')).toLowerCase()
    const tech = (p.tech || []).join(' ').toLowerCase()

    if (activeFilter === 'ai') {
      return title.includes('ai') || title.includes('ia') || title.includes('agent') || title.includes('exchange') || desc.includes('nlp') || desc.includes('saas') || desc.includes('intelligence')
    }
    if (activeFilter === 'health') {
      return title.includes('partocare') || title.includes('clinic') || title.includes('clinique') || desc.includes('health') || desc.includes('santé') || desc.includes('maternité')
    }
    if (activeFilter === 'fullstack') {
      return tech.includes('react') || tech.includes('laravel') || tech.includes('node') || tech.includes('full-stack')
    }
    return true
  })

  return (
    <section id="projects" className="section">
      <div className="section-head">
        <p className="kicker">{projectsSection?.kicker ?? 'Featured Projects'}</p>
        <h2 className="section-title">{projectsSection?.title ?? "Featured Work & Engineering Creations"}</h2>
        <p className="section-subtitle">
          {projectsSection?.subtitle ?? 'Real-world applications spanning autonomous AI agents, financial SaaS platforms, offline-first digital healthcare, and full-stack web architectures.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-wrapper">
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <FaLayerGroup /> {filterLabels.all} ({(projects ?? []).length})
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ai')}
        >
          <FaBrain style={{ color: 'var(--accent-bright)' }} /> {filterLabels.ai}
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'health' ? 'active' : ''}`}
          onClick={() => setActiveFilter('health')}
        >
          <FaHeartbeat /> {filterLabels.health}
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'fullstack' ? 'active' : ''}`}
          onClick={() => setActiveFilter('fullstack')}
        >
          <FaCode /> {filterLabels.fullstack}
        </button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid-modern">
        {filteredProjects.map((p) => (
          <ProjectCard 
            key={p.title} 
            project={p} 
            onClick={() => setSelectedProject(p)} 
            ui={ui}
            projectsSection={projectsSection}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          ui={ui}
        />
      )}
    </section>
  )
}
