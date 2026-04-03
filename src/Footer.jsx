import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <span>
        <span className="footer-accent">GameHub</span> &mdash; {new Date().getFullYear()} &mdash; Built with React
      </span>
    </footer>
  )
}

export default Footer
