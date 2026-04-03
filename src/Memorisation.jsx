import { useState, useEffect, useRef } from 'react'

const Memorisation = () => {
  const [stage, setStage] = useState(1)
  const [sequence, setSequence] = useState([])
  const [userInput, setUserInput] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [flashingCell, setFlashingCell] = useState(null)
  const [message, setMessage] = useState('')
  const playbackTimeoutRef = useRef(null)

  // Cell positions: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
  const cells = [0, 1, 2, 3]

  // Generate random sequence for current stage
  const generateSequence = (stageNum) => {
    const newSequence = []
    for (let i = 0; i < stageNum; i++) {
      newSequence.push(Math.floor(Math.random() * 4))
    }
    return newSequence
  }

  // Initialize game
  const initializeGame = () => {
    setStage(1)
    const newSequence = generateSequence(1)
    setSequence(newSequence)
    setUserInput([])
    setMessage('')
    setFlashingCell(null)
  }

  // Play sequence
  const playSequence = (seq) => {
    setIsPlaying(true)
    setUserInput([])
    setMessage('')
    
    let index = 0
    const flashDuration = 500
    const delayBetweenFlashes = 200

    const flashNext = () => {
      if (index < seq.length) {
        // Flash the cell
        setFlashingCell(seq[index])
        
        // Turn off flash after duration
        playbackTimeoutRef.current = setTimeout(() => {
          setFlashingCell(null)
          
          // Move to next flash after delay
          playbackTimeoutRef.current = setTimeout(() => {
            index++
            flashNext()
          }, delayBetweenFlashes)
        }, flashDuration)
      } else {
        // Sequence finished, enable user input
        setIsPlaying(false)
      }
    }

    flashNext()
  }

  // Initialize on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Play sequence when it changes
  useEffect(() => {
    if (sequence.length > 0) {
      playSequence(sequence)
    }
    
    // Cleanup timeouts on unmount
    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current)
      }
    }
  }, [sequence])

  // Handle cell click
  const handleCellClick = (cellIndex) => {
    if (isPlaying) return // Ignore clicks during playback

    const newUserInput = [...userInput, cellIndex]
    const currentIndex = userInput.length

    // Check if this click is correct
    if (cellIndex === sequence[currentIndex]) {
      // Correct click
      setUserInput(newUserInput)

      // Check if sequence is complete
      if (newUserInput.length === sequence.length) {
        // Stage complete!
        if (stage === 5) {
          // Win condition
          setTimeout(() => {
            alert('You win!')
            
            // Update dashboard tally
            const currentGamesWon = parseInt(localStorage.getItem('gamesWon') || '0', 10)
            localStorage.setItem('gamesWon', (currentGamesWon + 1).toString())
            
            // Reset to stage 1
            initializeGame()
          }, 100)
        } else {
          // Advance to next stage
          setTimeout(() => {
            const nextStage = stage + 1
            setStage(nextStage)
            const newSequence = generateSequence(nextStage)
            setSequence(newSequence)
          }, 500)
        }
      }
    } else {
      // Incorrect click
      setMessage('Incorrect, try again')
      setTimeout(() => {
        setMessage('')
        // Replay the same sequence
        playSequence(sequence)
      }, 1000)
    }
  }

  // Handle reset
  const handleReset = () => {
    // Clear any ongoing timeouts
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current)
    }
    initializeGame()
  }

  // Get cell style
  const getCellStyle = (cellIndex) => {
    const baseStyle = {
      width: '120px',
      height: '120px',
      backgroundColor: flashingCell === cellIndex ? '#FFD700' : '#4A90E2',
      border: '3px solid #333',
      borderRadius: '8px',
      cursor: isPlaying ? 'not-allowed' : 'pointer',
      transition: 'all 0.1s ease',
      boxShadow: flashingCell === cellIndex 
        ? '0 0 20px rgba(255, 215, 0, 0.8)' 
        : '0 2px 5px rgba(0,0,0,0.2)'
    }
    return baseStyle
  }

  return (
    <div style={{
      marginTop: '80px',
      marginBottom: '60px',
      padding: '20px',
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 className="game-title">Memorisation Game</h1>

      {/* Stage indicator */}
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#a78bfa'
      }}>
        Stage {stage} of 5
      </div>

      {/* Status message */}
      <div style={{
        minHeight: '30px',
        marginBottom: '20px'
      }}>
        {isPlaying && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            color: '#67e8f9',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '8px',
            fontSize: '16px'
          }}>
            Watch the sequence...
          </div>
        )}
        {message && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(248, 113, 113, 0.12)',
            color: '#fca5a5',
            border: '1px solid rgba(248, 113, 113, 0.35)',
            borderRadius: '8px',
            fontSize: '16px'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Grid of cells */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 120px)',
        gridTemplateRows: 'repeat(2, 120px)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {cells.map(cellIndex => (
          <div
            key={cellIndex}
            onClick={() => handleCellClick(cellIndex)}
            style={getCellStyle(cellIndex)}
            onMouseOver={(e) => {
              if (!isPlaying && flashingCell !== cellIndex) {
                e.target.style.backgroundColor = '#5BA3F5'
              }
            }}
            onMouseOut={(e) => {
              if (!isPlaying && flashingCell !== cellIndex) {
                e.target.style.backgroundColor = '#4A90E2'
              }
            }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div style={{
        fontSize: '16px',
        color: '#a78bfa',
        marginBottom: '20px',
        fontWeight: '600'
      }}>
        {!isPlaying && `${userInput.length} / ${sequence.length} clicks`}
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        style={{
          padding: '10px 25px',
          fontSize: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
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

export default Memorisation
