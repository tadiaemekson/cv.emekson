import { useState } from 'react'
import {
  FaLaptopCode, FaServer, FaDatabase, FaTools, FaRobot, FaLayerGroup,
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaBootstrap, FaPhp, FaLaravel,
  FaNodeJs, FaDocker, FaGitAlt, FaGithub
} from 'react-icons/fa'
import {
  SiTypescript, SiTailwindcss, SiExpress, SiMysql, SiMongodb
} from 'react-icons/si'

const skillIcons = {
  'HTML5': <FaHtml5 style={{ color: '#e34f26' }} />,
  'CSS3': <FaCss3Alt style={{ color: '#1572b6' }} />,
  'JavaScript': <FaJs style={{ color: '#f7df1e' }} />,
  'TypeScript': <SiTypescript style={{ color: '#3178c6' }} />,
  'React': <FaReact style={{ color: '#61dafb' }} />,
  'Tailwind CSS': <SiTailwindcss style={{ color: '#38bdf8' }} />,
  'Bootstrap': <FaBootstrap style={{ color: '#7952b3' }} />,
  'PHP': <FaPhp style={{ color: '#777bb4' }} />,
  'Laravel': <FaLaravel style={{ color: '#ff2d20' }} />,
  'Node.js': <FaNodeJs style={{ color: '#339933' }} />,
  'Express': <SiExpress style={{ color: '#ffffff' }} />,
  'MySQL': <SiMysql style={{ color: '#4479a1' }} />,
  'MongoDB': <SiMongodb style={{ color: '#47a248' }} />,
  'Docker Basics': <FaDocker style={{ color: '#2496ed' }} />,
  'Git & GitHub': <FaGitAlt style={{ color: '#f05032' }} />,
}

function getCategoryIcon(title) {
  const t = (title || '').toLowerCase()
  if (t.includes('front')) return <FaLaptopCode />
  if (t.includes('back')) return <FaServer />
  if (t.includes('data') || t.includes('base') || t.includes('donnée')) return <FaDatabase />
  if (t.includes('ai') || t.includes('ia') || t.includes('intelligence')) return <FaRobot />
  return <FaTools />
}

export default function Skills({ skills, skillsSection }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filterMap = {
    all: skillsSection?.filters?.all ?? 'All Skills',
    frontend: skillsSection?.filters?.frontend ?? 'Frontend',
    backend: skillsSection?.filters?.backend ?? 'Backend',
    database: skillsSection?.filters?.database ?? 'Databases',
    tools: skillsSection?.filters?.tools ?? 'Tools & AI'
  }

  const filteredCategories = (skills ?? []).filter(cat => {
    if (activeFilter === 'all') return true
    const title = cat.title.toLowerCase()
    if (activeFilter === 'frontend') return title.includes('front')
    if (activeFilter === 'backend') return title.includes('back')
    if (activeFilter === 'database') return title.includes('data') || title.includes('base') || title.includes('donnée')
    if (activeFilter === 'tools') return title.includes('tool') || title.includes('outil') || title.includes('ai') || title.includes('ia')
    return true
  })

  return (
    <section id="skills" className="section">
      <div className="section-head">
        <p className="kicker">{skillsSection?.kicker ?? 'Skills & Arsenal'}</p>
        <h2 className="section-title">{skillsSection?.title ?? 'Tools I use to build scalable products'}</h2>
        <p className="section-subtitle">
          {skillsSection?.subtitle ?? 'Technologies and tools I work with daily across frontend, backend, database architectures, and development workflows.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-wrapper">
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <FaLayerGroup /> {filterMap.all}
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'frontend' ? 'active' : ''}`}
          onClick={() => setActiveFilter('frontend')}
        >
          <FaLaptopCode /> {filterMap.frontend}
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'backend' ? 'active' : ''}`}
          onClick={() => setActiveFilter('backend')}
        >
          <FaServer /> {filterMap.backend}
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'database' ? 'active' : ''}`}
          onClick={() => setActiveFilter('database')}
        >
          <FaDatabase /> {filterMap.database}
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveFilter('tools')}
        >
          <FaTools /> {filterMap.tools}
        </button>
      </div>

      {/* Skills Grid */}
      <div className="skills-grid-modern">
        {filteredCategories.map((cat) => (
          <div key={cat.title} className="card skill-category-card">
            <div className="skill-category-header">
              <div className="skill-cat-icon">
                {getCategoryIcon(cat.title)}
              </div>
              <h3 className="skill-cat-title">{cat.title}</h3>
            </div>

            <div className="skill-pills-wrap">
              {(cat.tags ?? []).map((tag) => (
                <div key={tag} className="skill-pill">
                  {skillIcons[tag] && (
                    <span className="skill-pill-icon">{skillIcons[tag]}</span>
                  )}
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
