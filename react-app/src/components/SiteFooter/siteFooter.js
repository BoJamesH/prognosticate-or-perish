import './siteFooter.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="logo">
          {/* <img src="logo.png" alt="Company Logo" /> */}
          <span className='footer-created-by'>created by</span>
          <span className='footer-creator-name'>Bo James Hancock</span>
        </div>
        <div className="social">
          <a href="https://github.com/BoJamesH" target="_blank"><img className='footer-github-logo' src='https://i.imgur.com/TlTxa9R.png' alt='GitHub Logo'></img></a>
          <a href="https://www.linkedin.com/in/bo-j-1a1312276/"><img className='footer-linkedin-logo' src='https://i.imgur.com/cEP0sss.png' alt='LinkedIn Logo'></img></a>
          <a href="mailto:RobertJamesH@gmail.com"><img className='footer-email-logo' src='https://i.imgur.com/RZMdEMn.png' alt='Email Icon'></img></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
