export default function Footer({ profile, footerLabels }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="muted">
          &copy; {year} {profile?.name ?? 'TADIA FONGE EMEKSON'}. {footerLabels?.rights ?? 'All rights reserved.'}
        </span>
        <a className="text-link" href="#top" title={footerLabels?.backToTop ?? 'Back to top'}>
          ^
        </a>
      </div>
    </footer>
  )
}
