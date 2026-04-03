import React, { useState, useEffect, useRef } from 'react'

const GRID_WIDTH = 10
const GRID_HEIGHT = 12

const SHAPES = [
  { width: 2, height: 2 }, // 2x2 block
  { width: 1, height: 2 }, // 2x1 block (2 high, 1 wide)
  { width: 1, height: 1 }, // 1x1 block
]

const Tetro = () => {
  const [grid, setGrid] = useState([])
  const [gameActive, setGameActive] = useState(false)
  const [currentBlock, setCurrentBlock] = useState(null)
  const [lockedCells, setLockedCells] = useState(new Set())
  const [greenRows, setGreenRows] = useState(new Set())
  const intervalRef = useRef(null)

  // Initialize grid
  useEffect(() => {
    resetGame()
  }, [])

  // Handle block falling
  useEffect(() => {
    if (gameActive && currentBlock) {
      intervalRef.current = setInterval(() => {
        moveBlockDown()
      }, 1000)

      return () => clearInterval(intervalRef.current)
    }
  }, [gameActive, currentBlock, lockedCells])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameActive || !currentBlock) return

      if (e.key === 'ArrowLeft') {
        moveBlockHorizontal(-1)
      } else if (e.key === 'ArrowRight') {
        moveBlockHorizontal(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameActive, currentBlock, lockedCells])

  const resetGame = () => {
    setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false)))
    setGameActive(false)
    setCurrentBlock(null)
    setLockedCells(new Set())
    setGreenRows(new Set())
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const spawnNewBlock = () => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    setCurrentBlock({
      x: 0,
      y: 0,
      width: randomShape.width,
      height: randomShape.height,
    })
  }

  const handleBoardClick = () => {
    if (!gameActive) {
      setGameActive(true)
      spawnNewBlock()
    }
  }

  const getBlockCells = (block) => {
    const cells = []
    for (let dy = 0; dy < block.height; dy++) {
      for (let dx = 0; dx < block.width; dx++) {
        cells.push(`${block.y + dy},${block.x + dx}`)
      }
    }
    return cells
  }

  const canMove = (block, deltaX, deltaY) => {
    const newX = block.x + deltaX
    const newY = block.y + deltaY

    // Check boundaries
    if (newX < 0 || newX + block.width > GRID_WIDTH) return false
    if (newY < 0 || newY + block.height > GRID_HEIGHT) return false

    // Check collision with locked cells
    for (let dy = 0; dy < block.height; dy++) {
      for (let dx = 0; dx < block.width; dx++) {
        const cellKey = `${newY + dy},${newX + dx}`
        if (lockedCells.has(cellKey)) return false
      }
    }

    return true
  }

  const moveBlockHorizontal = (delta) => {
    if (!currentBlock) return
    if (canMove(currentBlock, delta, 0)) {
      setCurrentBlock({ ...currentBlock, x: currentBlock.x + delta })
    }
  }

  const moveBlockDown = () => {
    if (!currentBlock) return

    if (canMove(currentBlock, 0, 1)) {
      setCurrentBlock({ ...currentBlock, y: currentBlock.y + 1 })
    } else {
      lockBlock()
    }
  }

  const lockBlock = () => {
    if (!currentBlock) return

    // Add current block cells to locked cells
    const newLockedCells = new Set(lockedCells)
    const blockCells = getBlockCells(currentBlock)
    
    // Check if block is in rows 0-7 (higher than row 8)
    let gameOver = false
    for (const cell of blockCells) {
      const [row] = cell.split(',').map(Number)
      if (row < 8) {
        gameOver = true
      }
      newLockedCells.add(cell)
    }

    setLockedCells(newLockedCells)

    // Check for filled rows
    const newGreenRows = new Set(greenRows)
    for (let row = 0; row < GRID_HEIGHT; row++) {
      let rowFilled = true
      for (let col = 0; col < GRID_WIDTH; col++) {
        const cellKey = `${row},${col}`
        if (!newLockedCells.has(cellKey)) {
          rowFilled = false
          break
        }
      }
      if (rowFilled) {
        newGreenRows.add(row)
      }
    }

    setGreenRows(newGreenRows)

    // Check win condition
    if (newGreenRows.size >= 5) {
      setTimeout(() => {
        alert('Congrats!')
        resetGame()
      }, 100)
      return
    }

    // Check lose condition
    if (gameOver) {
      setTimeout(() => {
        alert('Failed.')
        resetGame()
      }, 100)
      return
    }

    // Spawn new block
    spawnNewBlock()
  }

  const isCellOccupied = (row, col) => {
    const cellKey = `${row},${col}`
    
    // Check if it's part of locked cells
    if (lockedCells.has(cellKey)) return true
    
    // Check if it's part of current block
    if (currentBlock) {
      for (let dy = 0; dy < currentBlock.height; dy++) {
        for (let dx = 0; dx < currentBlock.width; dx++) {
          if (currentBlock.y + dy === row && currentBlock.x + dx === col) {
            return true
          }
        }
      }
    }
    
    return false
  }

  const getCellColor = (row, col) => {
    if (greenRows.has(row) && lockedCells.has(`${row},${col}`)) {
      return 'rgb(0,255,0)'
    }
    if (isCellOccupied(row, col)) {
      return '#4a9eff'
    }
    return 'transparent'
  }

  return (
    <div className="main-body">
      <h1 className="game-title" style={{ paddingTop: '16px' }}>Tetro</h1>
      <div
        onClick={handleBoardClick}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
          margin: '20px 20px 100px 20px',
          height: 'calc(100vh - 80px - 50px - 20px - 100px)', // viewport - header - footer - top margin - bottom margin
          cursor: gameActive ? 'default' : 'pointer',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                border: '1px solid #333333',
                backgroundColor: getCellColor(rowIndex, colIndex),
              }}
            />
          ))
        )}
      </div>
      <button
        onClick={resetGame}
        style={{
          display: 'block',
          margin: '0 auto 20px auto',
        }}
      >
        Reset
      </button>
    </div>
  )
}

export default Tetro
