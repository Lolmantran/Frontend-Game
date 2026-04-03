import { useState, useEffect } from 'react'

const TowerOfHanoi = () => {
  const [numDisks, setNumDisks] = useState(5)
  const [pegs, setPegs] = useState({ A: [], B: [], C: [] })
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [message, setMessage] = useState('')

  // Initialize game with specified number of disks
  const initializeGame = (diskCount) => {
    const initialDisks = []
    for (let i = diskCount; i >= 1; i--) {
      initialDisks.push(i)
    }
    setPegs({ A: initialDisks, B: [], C: [] })
    setMoveCount(0)
    setSelectedPeg(null)
    setMessage('')
  }

  // Initialize on mount and when numDisks changes
  useEffect(() => {
    initializeGame(numDisks)
  }, [numDisks])

  // Check if player has won
  const checkWin = (newPegs) => {
    if (newPegs.C.length === numDisks) {
      // Check if disks are in correct order (largest to smallest)
      for (let i = 0; i < newPegs.C.length - 1; i++) {
        if (newPegs.C[i] < newPegs.C[i + 1]) {
          return false
        }
      }
      return true
    }
    return false
  }

  // Handle peg click
  const handlePegClick = (pegName) => {
    if (selectedPeg === null) {
      // First click - select source peg
      if (pegs[pegName].length > 0) {
        setSelectedPeg(pegName)
        setMessage('')
      }
    } else {
      // Second click - attempt move
      if (selectedPeg === pegName) {
        // Clicking same peg - deselect
        setSelectedPeg(null)
      } else {
        // Try to move disk
        const sourcePeg = pegs[selectedPeg]
        const destPeg = pegs[pegName]
        const diskToMove = sourcePeg[sourcePeg.length - 1]

        // Check if move is valid
        if (destPeg.length === 0 || diskToMove < destPeg[destPeg.length - 1]) {
          // Valid move
          const newPegs = {
            ...pegs,
            [selectedPeg]: sourcePeg.slice(0, -1),
            [pegName]: [...destPeg, diskToMove]
          }
          setPegs(newPegs)
          setMoveCount(moveCount + 1)
          setSelectedPeg(null)
          setMessage('')

          // Check for win
          if (checkWin(newPegs)) {
            setTimeout(() => {
              alert(`Congratulations! You solved it in ${moveCount + 1} moves!`)
              // Update dashboard tally
              const currentGamesWon = parseInt(localStorage.getItem('gamesWon') || '0', 10)
              localStorage.setItem('gamesWon', (currentGamesWon + 1).toString())
              // Reset game
              initializeGame(numDisks)
            }, 100)
          }
        } else {
          // Invalid move
          setMessage('Invalid move')
          setSelectedPeg(null)
          setTimeout(() => setMessage(''), 2000)
        }
      }
    }
  }

  // Handle reset button
  const handleReset = () => {
    initializeGame(numDisks)
  }

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setNumDisks(parseInt(e.target.value, 10))
  }

  // Get color for disk based on size
  const getDiskColor = (size) => {
    const colors = [
      '#FF6B6B', // 1 - smallest
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F', // 6
      '#BB8FCE',
      '#85C1E2'
    ]
    return colors[(size - 1) % colors.length]
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
      <h1 className="game-title">Tower of Hanoi</h1>
      
      <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: '#a78bfa' }}>
        Moves: {moveCount}
      </div>

      {message && (
        <div style={{
          marginBottom: '10px',
          padding: '8px 16px',
          backgroundColor: 'rgba(248, 113, 113, 0.12)',
          color: '#fca5a5',
          border: '1px solid rgba(248, 113, 113, 0.35)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      {/* Pegs container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '80px',
        marginBottom: '40px',
        padding: '20px'
      }}>
        {['A', 'B', 'C'].map(pegName => (
          <div key={pegName} style={{ textAlign: 'center' }}>
            {/* Peg label */}
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: selectedPeg === pegName ? '#06b6d4' : '#8888aa'
            }}>
              Peg {pegName}
            </div>

            {/* Rod container with disks */}
            <div
              onClick={() => handlePegClick(pegName)}
              style={{
                position: 'relative',
                width: '140px',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              {/* Vertical rod */}
              <div style={{
                width: '8px',
                height: '100%',
                backgroundColor: selectedPeg === pegName ? '#007bff' : '#8B4513',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
                border: selectedPeg === pegName ? '2px solid #0056b3' : 'none',
                boxShadow: selectedPeg === pegName ? '0 0 10px rgba(0,123,255,0.5)' : 'none'
              }} />

              {/* Base */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '10px',
                backgroundColor: '#654321',
                borderRadius: '2px',
                zIndex: 0
              }} />

              {/* Disks on pole */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                zIndex: 2
              }}>
                {pegs[pegName].map((diskSize, index) => (
                  <div
                    key={index}
                    style={{
                      width: `${diskSize * 20}px`,
                      height: '22px',
                      backgroundColor: getDiskColor(diskSize),
                      border: '2px solid #333',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {diskSize}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '20px',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Reset Game
      </button>

      {/* Difficulty selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '16px',
        color: '#e2e2f0'
      }}>
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={numDisks}
          onChange={handleDifficultyChange}
          style={{
            padding: '5px 10px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            background: '#1e1e3a',
            color: '#e2e2f0',
            cursor: 'pointer'
          }}
        >
          <option value={3}>3 disks</option>
          <option value={4}>4 disks</option>
          <option value={5}>5 disks (default)</option>
        </select>
      </div>
    </div>
  )
}

export default TowerOfHanoi
