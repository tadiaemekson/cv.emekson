import { jsPDF } from 'jspdf'
import { HiOutlineDocumentDownload } from 'react-icons/hi'

export default function ResumeButton({ portfolio, ui }) {
  const downloadResume = () => {
    const doc = new jsPDF()
    const isEN = portfolio.nav.about === 'About'
    
    // Extract localized data
    const { 
      profile, 
      about,
      skills, 
      projects, 
      educationHistory, 
      experience, 
      languages, 
      qualities, 
      interests, 
      contact,
      nav,
      educationSection
    } = portfolio

    // Colors & Fonts
    const PRIMARY_ACCENT = [16, 185, 129] // #10b981
    const SECONDARY_TEXT = [100, 116, 139] // Slate 500
    const MAIN_TEXT = [30, 41, 59] // Slate 800
    const FONT_FAMILY = 'times'

    let y = 20
    const margin = 20
    const pageWidth = 210
    const contentWidth = pageWidth - (margin * 2)

    const checkPageEnd = (neededSpace) => {
      if (y + neededSpace > 275) {
        doc.addPage()
        y = 20
        doc.setFont(FONT_FAMILY, 'normal')
        return true
      }
      return false
    }

    const renderSectionHeader = (title) => {
      checkPageEnd(20)
      y += 12
      doc.setFontSize(14) // Size 14 for titles
      doc.setFont(FONT_FAMILY, 'bold')
      doc.setTextColor(...PRIMARY_ACCENT)
      doc.text(title.toUpperCase(), margin, y)
      
      doc.setDrawColor(...PRIMARY_ACCENT)
      doc.setLineWidth(0.5)
      doc.line(margin, y + 2, pageWidth - margin, y + 2)
      
      doc.setTextColor(...MAIN_TEXT)
      doc.setFont(FONT_FAMILY, 'normal')
      y += 10
    }

    // --- Header ---
    doc.setFont(FONT_FAMILY, 'bold')
    doc.setFontSize(26) // Name Header
    doc.setTextColor(...PRIMARY_ACCENT)
    doc.text(profile.name.toUpperCase(), margin, y)
    
    y += 10
    doc.setFontSize(12) // Subtitle
    doc.setTextColor(...SECONDARY_TEXT)
    doc.setFont(FONT_FAMILY, 'italic')
    doc.text(profile.role, margin, y)
    
    y += 8
    doc.setTextColor(...MAIN_TEXT)
    doc.setFont(FONT_FAMILY, 'normal')
    doc.setFontSize(10) // Document Structure (Contact)
    
    const contactLine1 = `${contact.location}  |  ${contact.email}  |  ${contact.phones.join(' / ')}`
    doc.text(contactLine1, margin, y)
    
    y += 5
    const contactLine2 = `GitHub: ${contact.github.replace('https://', '')}  |  LinkedIn: ${contact.linkedin.replace('https://', '')}`
    doc.text(contactLine2, margin, y)

    // --- Professional Profile ---
    renderSectionHeader(isEN ? 'Professional Profile' : 'Profil Professionnel')
    doc.setFontSize(10) // Document Structure
    doc.setTextColor(...MAIN_TEXT)
    const splitBio = doc.splitTextToSize(about?.bio || profile?.bio || '', contentWidth)
    doc.text(splitBio, margin, y, { lineHeightFactor: 1.5 })
    y += (splitBio.length * 5) + 2

    // --- Technical Skills ---
    renderSectionHeader(nav.skills)
    doc.setFontSize(10) // Document Structure
    skills.forEach(skillGroup => {
      checkPageEnd(12)
      doc.setFont(FONT_FAMILY, 'bold')
      doc.text(`${skillGroup.title}:`, margin, y)
      
      doc.setFont(FONT_FAMILY, 'normal')
      const skillList = skillGroup.tags.join(', ')
      const splitSkills = doc.splitTextToSize(skillList, contentWidth - 50)
      doc.text(splitSkills, margin + 50, y)
      y += Math.max(5, (splitSkills.length * 5))
    })
    y += 2

    // --- Experience ---
    renderSectionHeader(educationSection.experience)
    experience.forEach(exp => {
      const detailLines = (exp.details || []).map(d => doc.splitTextToSize(`• ${d}`, contentWidth - 5))
      const totalDetailHeight = detailLines.flat().length * 5
      checkPageEnd(totalDetailHeight + 15)
      
      doc.setFont(FONT_FAMILY, 'bold')
      doc.setFontSize(12) // Subtitle (Job Title)
      doc.text(exp.title, margin, y)
      
      doc.setFont(FONT_FAMILY, 'normal')
      doc.setFontSize(10) // Document Structure
      doc.setTextColor(...SECONDARY_TEXT)
      const expSub = exp.company ? `${exp.company}  |  ${exp.location}` : exp.location
      doc.text(expSub, margin, y + 5)
      if (exp.period) doc.text(exp.period, pageWidth - margin, y + 5, { align: 'right' })
      
      y += 12
      doc.setTextColor(...MAIN_TEXT)
      detailLines.forEach(lines => {
        doc.text(lines, margin + 2, y)
        y += (lines.length * 5)
      })
      y += 2
    })

    // --- Projects ---
    renderSectionHeader(nav.projects)
    projects.forEach(project => {
      const splitDesc = doc.splitTextToSize(project.description, contentWidth)
      checkPageEnd(splitDesc.length * 5 + 15)
      
      doc.setFont(FONT_FAMILY, 'bold')
      doc.setFontSize(12) // Subtitle (Project Title)
      doc.text(project.title, margin, y)
      
      doc.setFont(FONT_FAMILY, 'normal')
      doc.setFontSize(10) // Document Structure
      doc.setTextColor(...SECONDARY_TEXT)
      const techText = `Technologies: ${project.tech.join(', ')}`
      doc.text(techText, pageWidth - margin, y, { align: 'right' })
      
      y += 6
      doc.setFontSize(10) // Document Structure
      doc.setTextColor(...MAIN_TEXT)
      doc.text(splitDesc, margin, y)
      y += (splitDesc.length * 5) + 4
    })

    // --- Education ---
    renderSectionHeader(educationSection.education)
    educationHistory.forEach(edu => {
      checkPageEnd(15)
      doc.setFont(FONT_FAMILY, 'bold')
      doc.setFontSize(12) // Subtitle (Degree)
      doc.text(edu.degree, margin, y)
      
      doc.setFont(FONT_FAMILY, 'normal')
      doc.setFontSize(10) // Document Structure
      doc.text(edu.school, margin, y + 5)
      doc.setTextColor(...SECONDARY_TEXT)
      doc.text(`${edu.location}  |  ${edu.period}`, pageWidth - margin, y + 5, { align: 'right' })
      
      doc.setTextColor(...MAIN_TEXT)
      y += 12
    })

    // --- Languages & Personal ---
    checkPageEnd(40)
    renderSectionHeader(isEN ? 'Additional Information' : 'Informations Complémentaires')
    
    doc.setFontSize(10) // Document Structure
    doc.setFont(FONT_FAMILY, 'bold')
    doc.text(`${educationSection.languages}:`, margin, y)
    doc.setFont(FONT_FAMILY, 'normal')
    const langText = languages.map(l => `${l.name} (${l.level})`).join('  •  ')
    doc.text(langText, margin + 35, y)
    
    y += 8
    doc.setFont(FONT_FAMILY, 'bold')
    doc.text(`${educationSection.qualities}:`, margin, y)
    doc.setFont(FONT_FAMILY, 'normal')
    const qualText = qualities.join(', ')
    const splitQual = doc.splitTextToSize(qualText, contentWidth - 35)
    doc.text(splitQual, margin + 35, y)
    
    y += (splitQual.length * 5) + 3
    doc.setFont(FONT_FAMILY, 'bold')
    doc.text(`${educationSection.interests}:`, margin, y)
    doc.setFont(FONT_FAMILY, 'normal')
    const intText = interests.join(', ')
    doc.text(intText, margin + 35, y)

    doc.save(`Resume_${profile.name.replace(/\s+/g, '_')}_${isEN ? 'EN' : 'FR'}.pdf`)
  }

  return (
    <button onClick={downloadResume} className="btn btn-primary" style={{ marginTop: '12px', color: 'inherit' }}>
      <HiOutlineDocumentDownload style={{ marginRight: '8px', fontSize: '20px' }} />
      {ui?.downloadCV ?? 'Download Resume (PDF)'}
    </button>
  )
}
