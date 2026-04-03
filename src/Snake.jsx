import { useState, useEffect, useRef, useCallback } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 25
const INITIAL_SNAKE = [
  { row: 10, col: 10 },
  { row: 10, col: 9 },
  { row: 10, col: 8 }
]
const INITIAL_DIRECTION = { row: 0, col: 1 } // moving right
const GAME_SPEED = 150

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  
  const directionRef = useRef(INITIAL_DIRECTION)
  const gameLoopRef = useRef(null)

  // Generate random food position
  const generateFood = useCallback((currentSnake) => {
    const emptyCells = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isSnake = currentSnake.some(segment => segment.row === row && segment.col === col)
        if (!isSnake) {
          emptyCells.push({ row, col })
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length)
      return emptyCells[randomIndex]
    }
    return null
  }, [])

  // Initialize game
  const initializeGame = useCallback(() => {
    const initialSnake = INITIAL_SNAKE
    setSnake(initialSnake)
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    setFood(generateFood(initialSnake))
    setScore(0)
    setGameOver(false)
  }, [generateFood])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return

      const newDirection = { ...directionRef.current }
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault()
          // Cannot reverse direction (going down to up)
          if (directionRef.current.row !== 1) {
            newDirection.row = -1
            newDirection.col = 0
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          // Cannot reverse direction (going up to down)
          if (directionRef.current.row !== -1) {
            newDirection.row = 1
            newDirection.col = 0
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          // Cannot reverse direction (going right to left)
          if (directionRef.current.col !== 1) {
            newDirection.row = 0
            newDirection.col = -1
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          // Cannot reverse direction (going left to right)
          if (directionRef.current.col !== -1) {
            newDirection.row = 0
            newDirection.col = 1
          }
          break
        default:
          break
      }
      
      directionRef.current = newDirection
      setDirection(newDirection)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver])

  // Game loop
  useEffect(() => {
    if (gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead = {
          row: head.row + directionRef.current.row,
          col: head.col + directionRef.current.col
        }

        // Check wall collision
        if (newHead.row < 0 || newHead.row >= GRID_SIZE || 
            newHead.col < 0 || newHead.col >= GRID_SIZE) {
          setGameOver(true)
          return prevSnake
        }

        // Check self collision
        const hitSelf = prevSnake.some(segment => 
          segment.row === newHead.row && segment.col === newHead.col
        )
        if (hitSelf) {
          setGameOver(true)
          return prevSnake
        }

        // Create new snake
        const newSnake = [newHead, ...prevSnake]

        // Check if food is eaten
        if (food && newHead.row === food.row && newHead.col === food.col) {
          setScore(prev => prev + 1)
          setFood(generateFood(newSnake))
          // Don't remove tail (snake grows)
        } else {
          // Remove tail (snake moves)
          newSnake.pop()
        }

        return newSnake
      })
    }, GAME_SPEED)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameOver, food, generateFood])

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        alert(`Game Over! Your score: ${score}`)
        
        // Update games won count
        const currentWins = parseInt(localStorage.getItem('gamesWon') || '0', 10)
        localStorage.setItem('gamesWon', (currentWins + 1).toString())
        
        // Reset game
        initializeGame()
      }, 100)
    }
  }, [gameOver, score, initializeGame])

  // Initialize on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Reset game handler
  const handleReset = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
    initializeGame()
  }

  // Render grid
  const renderGrid = () => {
    const grid = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isSnakeHead = snake[0] && snake[0].row === row && snake[0].col === col
        const isSnakeBody = snake.slice(1).some(segment => segment.row === row && segment.col === col)
        const isFood = food && food.row === row && food.col === col

        let cellClass = 'snake-cell'
        if (isSnakeHead) cellClass += ' snake-head'
        else if (isSnakeBody) cellClass += ' snake-body'
        else if (isFood) cellClass += ' snake-food'

        grid.push(
          <div
            key={`${row}-${col}`}
            className={cellClass}
          />
        )
      }
    }
    return grid
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
      <h1 className="game-title">Snake</h1>
      <p className="game-score">Score: {score}</p>

      <div className="snake-grid-wrap">
        {renderGrid()}
      </div>

      <button
        onClick={handleReset}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600'
        }}
      >
        Reset Game
      </button>
    </div>
  )
}

export default Snake
