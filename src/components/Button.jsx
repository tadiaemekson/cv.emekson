export default function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  ariaLabel,
}) {
  const className =
    variant === 'secondary'
      ? 'btn btn-secondary'
      : variant === 'ghost'
        ? 'btn btn-ghost'
        : 'btn btn-primary'

  if (href) {
    return (
      <a className={className} href={href} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}

