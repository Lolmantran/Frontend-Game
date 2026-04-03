import { useState, useEffect, useCallback } from 'react'

const Game2048 = () => {
  const [board, setBoard] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const createEmptyBoard = () => {
    return Array(4).fill(null).map(() => Array(4).fill(0))
  }

  const getRandomEmptyCell = (currentBoard) => {
    const emptyCells = []
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          emptyCells.push({ row, col })
        }
      }
    }
    if (emptyCells.length === 0) return null
    return emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  const addRandomTile = (currentBoard) => {
    const emptyCell = getRandomEmptyCell(currentBoard)
    if (!emptyCell) return currentBoard

    const newBoard = currentBoard.map(row => [...row])
    const value = Math.random() < 0.9 ? 2 : 4
    newBoard[emptyCell.row][emptyCell.col] = value
    return newBoard
  }

  const initializeGame = useCallback(() => {
    let newBoard = createEmptyBoard()
    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
  }, [])

  const boardsEqual = (board1, board2) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board1[row][col] !== board2[row][col]) return false
      }
    }
    return true
  }
  
  const moveLeft = (currentBoard) => {
    const newBoard = currentBoard.map(row => [...row])
    let moveScore = 0
    let moved = false

    for (let row = 0; row < 4; row++) {
      const tiles = newBoard[row].filter(val => val !== 0)
      const merged = []
      let i = 0

      while (i < tiles.length) {
        if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
          const mergedValue = tiles[i] * 2
          merged.push(mergedValue)
          moveScore += mergedValue
          i += 2
        } else {
          merged.push(tiles[i])
          i++
        }
      }

      while (merged.length < 4) {
        merged.push(0)
      }

      for (let col = 0; col < 4; col++) {
        if (newBoard[row][col] !== merged[col]) {
          moved = true
        }
      }

      newBoard[row] = merged
    }

    return { board: newBoard, score: moveScore, moved }
  }

  const rotateClockwise = (currentBoard) => {
    const newBoard = createEmptyBoard()
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newBoard[col][3 - row] = currentBoard[row][col]
      }
    }
    return newBoard
  }

  const rotateCounterClockwise = (currentBoard) => {
    const newBoard = createEmptyBoard()
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newBoard[3 - col][row] = currentBoard[row][col]
      }
    }
    return newBoard
  }

  const move = (direction) => {
    if (gameOver) return

    let workingBoard = board.map(row => [...row])
    let result

    switch (direction) {
      case 'left':
        result = moveLeft(workingBoard)
        break
      case 'right':
        workingBoard = workingBoard.map(row => row.reverse())
        result = moveLeft(workingBoard)
        result.board = result.board.map(row => row.reverse())
        break
      case 'up':
        workingBoard = rotateClockwise(workingBoard)
        result = moveLeft(workingBoard)
        result.board = rotateCounterClockwise(result.board)
        break
      case 'down':
        workingBoard = rotateCounterClockwise(workingBoard)
        result = moveLeft(workingBoard)
        result.board = rotateClockwise(result.board)
        break
      default:
        return
    }

    if (result.moved) {
      const newBoard = addRandomTile(result.board)
      setBoard(newBoard)
      setScore(prevScore => prevScore + result.score)

      if (has2048Tile(newBoard)) {
        setTimeout(() => {
          alert('You reached 2048!')
        }, 100)
      }

      setTimeout(() => {
        if (isGameOver(newBoard)) {
          const finalScore = score + result.score
          setGameOver(true)
          alert(`Game Over! Final score: ${finalScore}`)
          
          const currentGamesWon = parseInt(localStorage.getItem('gamesWon') || '0', 10)
          localStorage.setItem('gamesWon', (currentGamesWon + 1).toString())
          
          initializeGame()
        }
      }, 100)
    }
  }
  const has2048Tile = (currentBoard) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 2048) return true
      }
    }
    return false
  }

  // Check if game is over
  const isGameOver = (currentBoard) => {
    // Check if there are empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) return false
      }
    }

    // Check if any moves are possible
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = currentBoard[row][col]
        // Check right
        if (col < 3 && current === currentBoard[row][col + 1]) return false
        // Check down
        if (row < 3 && current === currentBoard[row + 1][col]) return false
      }
    }

    return true
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        
        switch (e.key) {
          case 'ArrowLeft':
            move('left')
            break
          case 'ArrowRight':
            move('right')
            break
          case 'ArrowUp':
            move('up')
            break
          case 'ArrowDown':
            move('down')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [board, score, gameOver])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Get tile color based on value
  const getTileColor = (value) => {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    }
    return colors[value] || '#3c3a32'
  }

  // Get text color based on value
  const getTextColor = (value) => {
    return value <= 4 ? '#776e65' : '#f9f6f2'
  }

  return (
    <div style={{
      marginTop: '80px',
      minHeight: 'calc(100vh - 130px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 className="game-title">2048</h1>
      <p className="game-score">Score: {score}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 100px)',
        gridTemplateRows: 'repeat(4, 100px)',
        gap: '10px',
        backgroundColor: '#1e1b18',
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 0 32px rgba(6, 182, 212, 0.1), 0 0 0 2px rgba(124, 58, 237, 0.3)'
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}-${cell}`}
              className={cell !== 0 ? 'tile-new' : ''}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: getTileColor(cell),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: cell >= 1000 ? '28px' : cell >= 100 ? '36px' : '42px',
                fontWeight: 'bold',
                color: getTextColor(cell),
                borderRadius: '6px',
                transition: 'background-color 0.12s ease'
              }}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>

      <button
        onClick={initializeGame}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
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

export default Game2048
