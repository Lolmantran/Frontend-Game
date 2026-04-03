import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImage from './assets/react.svg'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/slido', label: 'Slido' },
  { path: '/tetro', label: 'Tetro' },
  { path: '/tictactoe', label: 'TicTacToe' },
  { path: '/snake', label: 'Snake' },
  { path: '/minesweeper', label: 'Minesweeper' },
  { path: '/2048', label: '2048' },
  { path: '/hanoi', label: 'Hanoi' },
  { path: '/math', label: 'Math' },
  { path: '/memorisation', label: 'Memorisation' },
  { path: '/treasure', label: 'Treasure' },
]

const Header = () => {
  const location = useLocation()

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src={logoImage} alt="Logo" />
        <span className="header-logo-text">GameHub</span>
      </Link>
      <nav className="nav-links">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link${location.pathname === path ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default Header