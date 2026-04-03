import { useState, useEffect } from 'react'

const GRID_SIZE = 10
const MINE_COUNT = 10

const Minesweeper = () => {
  const [board, setBoard] = useState([])
  const [revealed, setRevealed] = useState([])
  const [flagged, setFlagged] = useState([])
  const [gameOver, setGameOver] = useState(false)

  // Initialize a new game
  const initializeGame = () => {
    const newBoard = createBoard()
    setBoard(newBoard)
    setRevealed(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)))
    setFlagged(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)))
    setGameOver(false)
  }

  // Create a new board with mines and numbers
  const createBoard = () => {
    // Initialize empty board
    const newBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
    
    // Place mines randomly
    const mines = []
    while (mines.length < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      const key = `${row},${col}`
      
      if (!mines.includes(key)) {
        mines.push(key)
        newBoard[row][col] = 'mine'
      }
    }
    
    // Calculate numbers for non-mine tiles
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newBoard[row][col] !== 'mine') {
          let count = 0
          
          // Check all 8 adjacent cells
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue
              
              const newRow = row + dr
              const newCol = col + dc
              
              if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                if (newBoard[newRow][newCol] === 'mine') {
                  count++
                }
              }
            }
          }
          
          newBoard[row][col] = count
        }
      }
    }
    
    return newBoard
  }

  // Flood fill reveal for tiles with 0 adjacent mines
  const revealTile = (row, col, newRevealed = null) => {
    if (newRevealed === null) {
      newRevealed = revealed.map(r => [...r])
    }
    
    // Check bounds
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
      return newRevealed
    }
    
    // Already revealed or flagged
    if (newRevealed[row][col] || flagged[row][col]) {
      return newRevealed
    }
    
    // Reveal this tile
    newRevealed[row][col] = true
    
    // If it's a 0, recursively reveal adjacent tiles
    if (board[row][col] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          revealTile(row + dr, col + dc, newRevealed)
        }
      }
    }
    
    return newRevealed
  }

  // Handle left click on a tile
  const handleLeftClick = (row, col) => {
    if (gameOver || revealed[row][col] || flagged[row][col]) {
      return
    }
    
    // If it's a mine, game over
    if (board[row][col] === 'mine') {
      // Reveal all mines
      const newRevealed = revealed.map(r => [...r])
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (board[r][c] === 'mine') {
            newRevealed[r][c] = true
          }
        }
      }
      setRevealed(newRevealed)
      setGameOver(true)
      
      setTimeout(() => {
        alert('Game Over! You hit a mine.')
        // Update dashboard - increment games played (loss)
        const currentScore = parseInt(localStorage.getItem('gamesWon') || '0', 10)
        localStorage.setItem('gamesWon', currentScore.toString())
        // Reset the game
        initializeGame()
      }, 100)
      
      return
    }
    
    // Reveal tile(s)
    const newRevealed = revealTile(row, col)
    setRevealed(newRevealed)
    
    // Check for win condition
    checkWin(newRevealed)
  }

  // Handle right click on a tile
  const handleRightClick = (e, row, col) => {
    e.preventDefault()
    
    if (gameOver || revealed[row][col]) {
      return
    }
    
    const newFlagged = flagged.map(r => [...r])
    newFlagged[row][col] = !newFlagged[row][col]
    setFlagged(newFlagged)
  }

  // Check if player has won
  const checkWin = (currentRevealed) => {
    let revealedCount = 0
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentRevealed[row][col]) {
          revealedCount++
        }
      }
    }
    
    // Win if all non-mine tiles are revealed
    const totalNonMineTiles = GRID_SIZE * GRID_SIZE - MINE_COUNT
    
    if (revealedCount === totalNonMineTiles) {
      setGameOver(true)
      
      setTimeout(() => {
        alert('Congratulations! You cleared the board!')
        // Update dashboard - increment games won
        const currentScore = parseInt(localStorage.getItem('gamesWon') || '0', 10)
        localStorage.setItem('gamesWon', (currentScore + 1).toString())
        // Trigger a storage event to update Dashboard
        window.dispatchEvent(new Event('storage'))
        // Reset the game
        initializeGame()
      }, 100)
    }
  }

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Render a single tile
  const renderTile = (row, col) => {
    const isRevealed = revealed[row][col]
    const isFlagged = flagged[row][col]
    const value = board[row][col]
    
    let content = ''
    let backgroundColor = '#cccccc'
    let color = '#000000'
    
    if (isFlagged) {
      content = '🚩'
      backgroundColor = '#cccccc'
    } else if (isRevealed) {
      backgroundColor = '#eeeeee'
      
      if (value === 'mine') {
        content = '💣'
      } else if (value > 0) {
        content = value
        // Color code numbers
        const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080']
        color = colors[value] || '#000000'
      }
    }
    
    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleLeftClick(row, col)}
        onContextMenu={(e) => handleRightClick(e, row, col)}
        style={{
          width: '40px',
          height: '40px',
          backgroundColor,
          border: '1px solid #999999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '18px',
          color,
          userSelect: 'none'
        }}
      >
        {content}
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '100px',
      marginBottom: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <h1 className="game-title">Minesweeper</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`,
        gap: '0',
        border: '2px solid #666666'
      }}>
        {board.map((row, rowIndex) => (
          row.map((_, colIndex) => renderTile(rowIndex, colIndex))
        ))}
      </div>
      
      <button
        onClick={initializeGame}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Reset Board
      </button>
    </div>
  )
}

export default Minesweeper
