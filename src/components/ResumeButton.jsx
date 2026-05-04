import { jsPDF } from 'jspdf'
import { portfolio } from '../data/portfolio'
import { HiOutlineDocumentDownload } from 'react-icons/hi'

export default function ResumeButton() {
  const downloadResume = () => {
    const doc = new jsPDF()
    const { profile, skills, projects, education, contact } = portfolio

    // ... (rest of the logic remains the same)
    // Title
    doc.setFontSize(22)
    doc.text(profile.name.toUpperCase(), 20, 20)

    // Subtitle
    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(`${profile.role} | ${profile.location}`, 20, 28)
    doc.setTextColor(0)

    // Contact Info
    doc.setFontSize(10)
    doc.text(`Email: ${contact.email}`, 20, 36)
    doc.text(`Phone: ${contact.phones.join(', ')}`, 20, 41)
    doc.text(`LinkedIn: ${contact.linkedin}`, 20, 46)
    doc.text(`GitHub: ${contact.github}`, 20, 51)

    // About
    doc.setFontSize(14)
    doc.text('PROFESSIONAL SUMMARY', 20, 65)
    doc.setLineWidth(0.5)
    doc.line(20, 67, 190, 67)
    doc.setFontSize(10)
    const splitBio = doc.splitTextToSize(profile.bio, 170)
    doc.text(splitBio, 20, 75)

    // Skills
    let y = 75 + (splitBio.length * 5) + 10
    doc.setFontSize(14)
    doc.text('TECHNICAL SKILLS', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    doc.setFontSize(10)
    y += 10
    skills.forEach(skillGroup => {
      doc.text(`${skillGroup.title}: ${skillGroup.tags.join(', ')}`, 20, y)
      y += 6
    })

    // Education
    y += 10
    doc.setFontSize(14)
    doc.text('EDUCATION', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    doc.setFontSize(10)
    y += 10
    doc.text(education.school, 20, y)
    doc.text(education.degree, 190, y, { align: 'right' })
    y += 5
    doc.text(education.location, 20, y)
    y += 10

    // Projects
    doc.setFontSize(14)
    doc.text('KEY PROJECTS', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    doc.setFontSize(10)
    y += 10
    projects.forEach(project => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold')
      doc.text(project.title, 20, y)
      doc.setFont('helvetica', 'normal')
      y += 5
      const splitDesc = doc.splitTextToSize(project.description, 170)
      doc.text(splitDesc, 20, y)
      y += (splitDesc.length * 5) + 2
      doc.text(`Tech: ${project.tech.join(', ')}`, 20, y)
      y += 10
    })

    doc.save(`Resume_${profile.name.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <button onClick={downloadResume} className="btn btn-primary" style={{ marginTop: '12px', color: 'inherit' }}>
      <HiOutlineDocumentDownload style={{ marginRight: '8px', fontSize: '20px' }} />
      Download Resume (PDF)
    </button>
  )
}
