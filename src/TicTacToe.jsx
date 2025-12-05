import { useState } from 'react'
import './App.css'

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6], // diagonal top-right to bottom-left
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) {
      return
    }

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const winner = calculateWinner(newBoard)
    if (winner) {
      setTimeout(() => {
        alert(`Player ${winner} wins!`)
        // Update the tally in localStorage
        const currentScore = parseInt(localStorage.getItem('gamesWon') || '0', 10)
        localStorage.setItem('gamesWon', (currentScore + 1).toString())
        // Reset the board
        setBoard(Array(9).fill(null))
        setIsXNext(true)
      }, 100)
    } else if (newBoard.every(square => square !== null)) {
      // Check for draw
      setTimeout(() => {
        alert('Draw!')
        // Reset the board
        setBoard(Array(9).fill(null))
        setIsXNext(true)
      }, 100)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gridTemplateRows: 'repeat(3, 100px)',
        gap: '5px',
      }}>
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: '100px',
              height: '100px',
              fontSize: '48px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: '#f0f0f0',
              border: '2px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: value === 'X' ? '#2196F3' : value === 'O' ? '#f44336' : '#000'
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <button
        onClick={handleReset}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Reset Game
      </button>
    </div>
  )
}

export default TicTacToe
