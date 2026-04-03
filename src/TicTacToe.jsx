import { useState, useEffect } from 'react'
import './App.css'

const TicTacToe = () => {
  const [gridSize, setGridSize] = useState(3)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  useEffect(() => {
    setBoard(Array(gridSize * gridSize).fill(null))
    setIsXNext(true)
  }, [gridSize])

  const calculateWinner = (squares, size) => {
    // Check rows
    for (let r = 0; r < size; r++) {
      const first = squares[r * size]
      if (!first) continue
      if (Array.from({ length: size }, (_, c) => squares[r * size + c]).every(v => v === first))
        return first
    }
    // Check columns
    for (let c = 0; c < size; c++) {
      const first = squares[c]
      if (!first) continue
      if (Array.from({ length: size }, (_, r) => squares[r * size + c]).every(v => v === first))
        return first
    }
    // Check main diagonal
    const diagFirst = squares[0]
    if (diagFirst && Array.from({ length: size }, (_, i) => squares[i * size + i]).every(v => v === diagFirst))
      return diagFirst
    // Check anti-diagonal
    const antiFirst = squares[size - 1]
    if (antiFirst && Array.from({ length: size }, (_, i) => squares[i * size + (size - 1 - i)]).every(v => v === antiFirst))
      return antiFirst
    return null
  }

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board, gridSize)) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const winner = calculateWinner(newBoard, gridSize)
    if (winner) {
      setTimeout(() => {
        alert(`Player ${winner} wins!`)
        const currentScore = parseInt(localStorage.getItem('gamesWon') || '0', 10)
        localStorage.setItem('gamesWon', (currentScore + 1).toString())
        setBoard(Array(gridSize * gridSize).fill(null))
        setIsXNext(true)
      }, 100)
    } else if (newBoard.every(square => square !== null)) {
      setTimeout(() => {
        alert('Draw!')
        setBoard(Array(gridSize * gridSize).fill(null))
        setIsXNext(true)
      }, 100)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const handleReset = () => {
    setBoard(Array(gridSize * gridSize).fill(null))
    setIsXNext(true)
  }

  const cellSize = Math.max(44, 115 - (gridSize - 3) * 12)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 160px)',
      marginTop: '80px',
      marginBottom: '80px'
    }}>
      <h1 className="game-title">Tic Tac Toe</h1>

      {/* Grid size slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <span style={{ color: '#8888aa', fontSize: '14px' }}>Grid Size</span>
        <input
          type="range"
          min="3"
          max="9"
          step="1"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          style={{ accentColor: '#7c3aed', width: '160px', cursor: 'pointer' }}
        />
        <span style={{ color: '#a78bfa', fontWeight: '700', fontSize: '16px', minWidth: '40px' }}>
          {gridSize}×{gridSize}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        gap: '0',
        border: '2px solid rgba(124, 58, 237, 0.5)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 0 32px rgba(124, 58, 237, 0.15)'
      }}>
        {board.map((value, index) => {
          const col = index % gridSize
          const row = Math.floor(index / gridSize)
          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                fontSize: `${cellSize * 0.42}px`,
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: '#181830',
                borderTop: row > 0 ? '1px solid rgba(124, 58, 237, 0.35)' : 'none',
                borderBottom: 'none',
                borderLeft: col > 0 ? '1px solid rgba(124, 58, 237, 0.35)' : 'none',
                borderRight: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: value === 'X' ? '#60a5fa' : value === 'O' ? '#f87171' : 'transparent',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => { if (!value) e.currentTarget.style.backgroundColor = '#1e1e3a' }}
              onMouseLeave={(e) => { if (!value) e.currentTarget.style.backgroundColor = '#181830' }}
            >
              {value}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleReset}
        style={{
          marginTop: '20px',
          padding: '10px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Reset Game
      </button>
    </div>
  )
}

export default TicTacToe
