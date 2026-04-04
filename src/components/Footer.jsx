export default function Footer({ profile }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="muted">(c) {year} {profile?.name ?? 'Your Name'}</span>
        <a className="text-link" href="#top">
          ^
        </a>
      </div>
    </footer>
  )
}

