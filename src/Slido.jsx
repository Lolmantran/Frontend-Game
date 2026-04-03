import { useState, useEffect, useRef } from 'react'

const Slido = () => {
  const [grid, setGrid] = useState([])
  const [blankPos, setBlankPos] = useState(0)
  const [moveCount, setMoveCount] = useState(0)
  const [isSolved, setIsSolved] = useState(false)
  const gridRef = useRef(null)

  // Initialize/reset the game
  const initializeGame = () => {
    let newGrid
    do {
      newGrid = generateRandomGrid()
    } while (isGridSolved(newGrid) || !isSolvable(newGrid))
    
    setGrid(newGrid)
    setBlankPos(newGrid.indexOf(0))
    setMoveCount(0)
    setIsSolved(false)
  }

  // Generate a random grid with numbers 0-8
  const generateRandomGrid = () => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }
    return numbers
  }

  // Check if grid is in solved state
  const isGridSolved = (gridToCheck) => {
    for (let i = 0; i < 8; i++) {
      if (gridToCheck[i] !== i + 1) return false
    }
    return gridToCheck[8] === 0
  }

  // Check if puzzle is solvable
  const isSolvable = (gridToCheck) => {
    let inversions = 0
    for (let i = 0; i < 9; i++) {
      for (let j = i + 1; j < 9; j++) {
        if (gridToCheck[i] !== 0 && gridToCheck[j] !== 0 && gridToCheck[i] > gridToCheck[j]) {
          inversions++
        }
      }
    }
    return inversions % 2 === 0
  }

  // Get adjacent positions to blank
  const getAdjacentPositions = (pos) => {
    const adjacent = []
    const row = Math.floor(pos / 3)
    const col = pos % 3
    
    if (row > 0) adjacent.push(pos - 3) // up
    if (row < 2) adjacent.push(pos + 3) // down
    if (col > 0) adjacent.push(pos - 1) // left
    if (col < 2) adjacent.push(pos + 1) // right
    
    return adjacent
  }

  // Move cell to blank position
  const moveCell = (cellPos) => {
    if (isSolved) return
    
    const adjacent = getAdjacentPositions(blankPos)
    if (!adjacent.includes(cellPos)) return
    
    const newGrid = [...grid]
    newGrid[blankPos] = newGrid[cellPos]
    newGrid[cellPos] = 0
    
    setGrid(newGrid)
    setBlankPos(cellPos)
    setMoveCount(moveCount + 1)
    
    // Check if solved
    if (isGridSolved(newGrid)) {
      setIsSolved(true)
      // Update games won count
      const currentWins = parseInt(localStorage.getItem('gamesWon') || '0', 10)
      localStorage.setItem('gamesWon', (currentWins + 1).toString())
      
      setTimeout(() => {
        alert('Correct!')
        initializeGame()
      }, 100)
    }
  }

  // Handle cell click
  const handleCellClick = (index) => {
    moveCell(index)
  }

  // Handle keyboard arrow keys
  const handleKeyDown = (e) => {
    if (isSolved) return
    
    const row = Math.floor(blankPos / 3)
    const col = blankPos % 3
    
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (row < 2) moveCell(blankPos + 3) // move cell below blank up
        break
      case 'ArrowDown':
        e.preventDefault()
        if (row > 0) moveCell(blankPos - 3) // move cell above blank down
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (col < 2) moveCell(blankPos + 1) // move cell right of blank left
        break
      case 'ArrowRight':
        e.preventDefault()
        if (col > 0) moveCell(blankPos - 1) // move cell left of blank right
        break
      default:
        break
    }
  }

  // Solve the puzzle
  const handleSolve = () => {
    const solvedGrid = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    setGrid(solvedGrid)
    setBlankPos(8)
    setIsSolved(true)
    
    // Update games won count
    const currentWins = parseInt(localStorage.getItem('gamesWon') || '0', 10)
    localStorage.setItem('gamesWon', (currentWins + 1).toString())
  }

  // Reset the game
  const handleReset = () => {
    initializeGame()
  }

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Add keyboard event listener when grid is focused
  useEffect(() => {
    const gridElement = gridRef.current
    if (gridElement) {
      gridElement.addEventListener('keydown', handleKeyDown)
      return () => {
        gridElement.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [blankPos, isSolved])

  return (
    <div className="main-body" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      padding: '20px'
    }}>
      <h1 className="game-title">Slido</h1>
      <div
        ref={gridRef}
        className="slido-grid"
        tabIndex="0"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, min(150px, 30vw))',
          gridTemplateRows: 'repeat(3, min(150px, 30vw))',
          gap: '0px',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        {grid.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              width: 'min(150px, 30vw)',
              height: 'min(150px, 30vw)',
              border: '1px solid #333',
              margin: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'min(48px, 10vw)',
              fontWeight: 'bold',
              backgroundColor: cell === 0 ? 'white' : '#4CAF50',
              color: cell === 0 ? 'black' : 'white',
              cursor: getAdjacentPositions(blankPos).includes(index) && !isSolved ? 'pointer' : 'default'
            }}
          >
            {cell === 0 ? '' : cell}
          </div>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginTop: '20px',
        maxWidth: 'min(450px, 90vw)',
        width: '100%'
      }}>
        <button 
          onClick={handleSolve}
          disabled={isSolved}
          style={{
            flex: 1,
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isSolved ? 'not-allowed' : 'pointer',
            opacity: isSolved ? 0.5 : 1
          }}
        >
          Solve
        </button>
        <button 
          onClick={handleReset}
          disabled={moveCount === 0 && !isSolved}
          style={{
            flex: 1,
            padding: '10px 20px',
            fontSize: '16px',
            cursor: (moveCount === 0 && !isSolved) ? 'not-allowed' : 'pointer',
            opacity: (moveCount === 0 && !isSolved) ? 0.5 : 1
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default Slido
