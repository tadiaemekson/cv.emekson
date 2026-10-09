import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let animationFrameId
    let targetX = -100
    let targetY = -100
    let currentX = -100
    let currentY = -100

    const onMouseMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const onMouseOver = (e) => {
      const target = e.target
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.card') ||
        target.closest('.filter-tab') ||
        target.closest('.tag-pill') ||
        target.closest('.quick-contact-card')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const onMouseDown = () => setIsClicked(true)
    const onMouseUp = () => setIsClicked(false)
    const onMouseLeave = () => setIsVisible(false)

    // Smooth lerp for trailing ring
    const loop = () => {
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      setTrailingPos({ x: currentX, y: currentY })
      animationFrameId = requestAnimationFrame(loop)
    }
    loop()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.body.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Precision Core Dot */}
      <div
        className={`custom-cursor-dot ${isHovering ? 'hovering' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      {/* Smooth Trailing Glow Ring */}
      <div
        className={`custom-cursor-ring ${isHovering ? 'hovering' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
        }}
      />
    </>
  )
}
