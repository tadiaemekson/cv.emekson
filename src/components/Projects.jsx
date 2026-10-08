import { useEffect, useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, FaLayerGroup, FaRocket, FaHeartbeat, FaCode } from 'react-icons/fa'
import { SiLaravel, SiReact, SiNodedotjs, SiPhp } from 'react-icons/si'
import ProjectModal from './ProjectModal'

const projectHeaderIcons = {
  'ExchangeCompare Africa': <SiLaravel />,
  'PartoCare': <FaHeartbeat />,
  'Gourmet Restaurant Platform': <SiReact />,
  'Premium Personal Portfolio': <FaRocket />,
  'Clinic Management System': <SiPhp />,
  'B-TECH Academic Project': <FaCode />,
  'Node.js Practice Server': <SiNodedotjs />,
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

  const icon = projectHeaderIcons[project.title] || <FaRocket />

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
    saas: projectsSection?.filters?.saas ?? 'SaaS & Fintech',
    health: projectsSection?.filters?.health ?? 'HealthTech & Systems',
    fullstack: projectsSection?.filters?.fullstack ?? 'Full-Stack Stack'
  }

  const filteredProjects = (projects ?? []).filter((p) => {
    if (activeFilter === 'all') return true
    const title = p.title.toLowerCase()
    const desc = (p.description + (p.details || '')).toLowerCase()
    const tech = (p.tech || []).join(' ').toLowerCase()

    if (activeFilter === 'saas') {
      return title.includes('exchange') || title.includes('restaurant') || title.includes('restauration') || desc.includes('saas') || desc.includes('fintech')
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
        <h2 className="section-title">{projectsSection?.title ?? "Featured Work & Engineering Projects"}</h2>
        <p className="section-subtitle">
          {projectsSection?.subtitle ?? 'Real-world applications spanning SaaS financial tools, offline-first digital healthcare, and full-stack web platforms.'}
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
          className={`filter-tab ${activeFilter === 'saas' ? 'active' : ''}`}
          onClick={() => setActiveFilter('saas')}
        >
          <FaRocket /> {filterLabels.saas}
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
