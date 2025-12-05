import React from 'react'
import { Link } from 'react-router-dom'
import logoImage from './assets/react.svg'

const Header = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '80px',
      backgroundColor: '#eeeeee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000
    }}>
      <img 
        src={logoImage} 
        alt="Logo" 
        style={{
          width: '50px',
          height: '50px',
          margin: '15px'
        }}
      />
      <nav style={{ marginRight: '15px' }}>
        <span className="nav-full">
          <Link to="/">Home</Link> | <Link to="/blanko">Blanko</Link> | <Link to="/slido">Slido</Link> | <Link to="/tetro">Tetro</Link> | <Link to="/tictactoe">TicTacToe</Link> | <Link to="/snake">Snake</Link> | <Link to="/minesweeper">Minesweeper</Link> | <Link to="/2048">2048</Link> | <Link to="/hanoi">Hanoi</Link> | <Link to="/math">Math</Link> | <Link to="/memorisation">Memorisation</Link> | <Link to="/treasure">Treasure</Link>
        </span>
        <span className="nav-short">
          <Link to="/">H</Link> | <Link to="/blanko">B</Link> | <Link to="/slido">S</Link> | <Link to="/tetro">T</Link> | <Link to="/tictactoe">TT</Link> | <Link to="/snake">Sn</Link> | <Link to="/minesweeper">M</Link> | <Link to="/2048">2048</Link> | <Link to="/hanoi">Ha</Link> | <Link to="/math">Ma</Link> | <Link to="/memorisation">Me</Link> | <Link to="/treasure">Tr</Link>
        </span>
      </nav>
    </header>
  )
}

export default Header