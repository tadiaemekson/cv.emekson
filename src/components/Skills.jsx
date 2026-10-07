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

const categoryIcons = {
  'Frontend Development': <FaLaptopCode />,
  'Backend Development': <FaServer />,
  'Database Management': <FaDatabase />,
  'Tools & Technologies': <FaTools />,
  'AI Tools Used': <FaRobot />,
}

export default function Skills({ skills }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filterMap = {
    'all': 'All Skills',
    'frontend': 'Frontend',
    'backend': 'Backend',
    'database': 'Databases',
    'tools': 'Tools & AI'
  }

  const filteredCategories = (skills ?? []).filter(cat => {
    if (activeFilter === 'all') return true
    const title = cat.title.toLowerCase()
    if (activeFilter === 'frontend') return title.includes('frontend')
    if (activeFilter === 'backend') return title.includes('backend')
    if (activeFilter === 'database') return title.includes('database')
    if (activeFilter === 'tools') return title.includes('tool') || title.includes('ai')
    return true
  })

  return (
    <section id="skills" className="section">
      <div className="section-head">
        <p className="kicker">Skills & Arsenal</p>
        <h2 className="section-title">Tools I use to build scalable products</h2>
        <p className="section-subtitle">
          Technologies and tools I work with daily across frontend, backend, database architectures, and development workflows.
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
                {categoryIcons[cat.title] || <FaTools />}
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
