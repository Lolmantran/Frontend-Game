import { useState, useEffect, useRef } from 'react'

const TreasureHunt = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLimit, setTimeLimit] = useState(30)
  const [coinCount, setCoinCount] = useState(10)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [coins, setCoins] = useState([])
  const [yellowCoinsFound, setYellowCoinsFound] = useState(0)
  const [totalYellowCoins, setTotalYellowCoins] = useState(0)
  const timerRef = useRef(null)

  // Check if two circles overlap
  const circlesOverlap = (x1, y1, x2, y2, radius) => {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return distance < radius * 2 + 10 // Add small margin
  }

  // Generate random position that doesn't overlap with existing coins
  const generateValidPosition = (existingCoins, radius, gameAreaWidth, gameAreaHeight) => {
    const maxAttempts = 100
    let attempts = 0

    while (attempts < maxAttempts) {
      const x = radius + Math.random() * (gameAreaWidth - radius * 2)
      const y = radius + Math.random() * (gameAreaHeight - radius * 2)

      let isValid = true
      for (const coin of existingCoins) {
        if (circlesOverlap(x, y, coin.x, coin.y, radius)) {
          isValid = false
          break
        }
      }

      if (isValid) {
        return { x, y }
      }
      attempts++
    }

    // Fallback: return a random position even if overlap occurs
    return {
      x: radius + Math.random() * (gameAreaWidth - radius * 2),
      y: radius + Math.random() * (gameAreaHeight - radius * 2)
    }
  }

  // Start game
  const handleStartGame = () => {
    const yellowCount = Math.floor(coinCount / 2)
    const brownCount = coinCount - yellowCount

    // Generate coins
    const newCoins = []
    const coinRadius = 25
    const gameAreaWidth = window.innerWidth - 100
    const gameAreaHeight = window.innerHeight - 300

    // Create yellow coins
    for (let i = 0; i < yellowCount; i++) {
      const pos = generateValidPosition(newCoins, coinRadius, gameAreaWidth, gameAreaHeight)
      newCoins.push({
        id: i,
        type: 'yellow',
        revealed: false,
        x: pos.x,
        y: pos.y
      })
    }

    // Create brown coins
    for (let i = 0; i < brownCount; i++) {
      const pos = generateValidPosition(newCoins, coinRadius, gameAreaWidth, gameAreaHeight)
      newCoins.push({
        id: yellowCount + i,
        type: 'brown',
        revealed: false,
        x: pos.x,
        y: pos.y
      })
    }

    // Shuffle coins
    for (let i = newCoins.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCoins[i], newCoins[j]] = [newCoins[j], newCoins[i]]
    }

    setCoins(newCoins)
    setTotalYellowCoins(yellowCount)
    setYellowCoinsFound(0)
    setTimeRemaining(timeLimit)
    setGameStarted(true)
  }

  // Handle coin click
  const handleCoinClick = (coinId) => {
    const updatedCoins = coins.map(coin => {
      if (coin.id === coinId && !coin.revealed) {
        const revealed = { ...coin, revealed: true }
        if (coin.type === 'yellow') {
          setYellowCoinsFound(prev => prev + 1)
        }
        return revealed
      }
      return coin
    })
    setCoins(updatedCoins)
  }

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timerRef.current)
    }
  }, [gameStarted, timeRemaining])

  // Check win condition
  useEffect(() => {
    if (gameStarted && yellowCoinsFound === totalYellowCoins && totalYellowCoins > 0) {
      clearInterval(timerRef.current)
      setTimeout(() => {
        alert('You found all the treasure!')
        
        // Update dashboard tally
        const currentGamesWon = parseInt(localStorage.getItem('gamesWon') || '0', 10)
        localStorage.setItem('gamesWon', (currentGamesWon + 1).toString())
        
        // Reset to setup screen
        handleReset()
      }, 100)
    }
  }, [yellowCoinsFound, totalYellowCoins, gameStarted])

  // Check loss condition
  useEffect(() => {
    if (gameStarted && timeRemaining === 0 && yellowCoinsFound < totalYellowCoins) {
      setTimeout(() => {
        alert("Time's up! You lose.")
        handleReset()
      }, 100)
    }
  }, [timeRemaining, gameStarted, yellowCoinsFound, totalYellowCoins])

  // Reset game
  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setGameStarted(false)
    setCoins([])
    setYellowCoinsFound(0)
    setTotalYellowCoins(0)
    setTimeRemaining(0)
  }

  // Get coin color
  const getCoinColor = (coin) => {
    if (!coin.revealed) return '#000'
    return coin.type === 'yellow' ? '#FFD700' : '#8B4513'
  }

  return (
    <div style={{
      marginTop: '80px',
      marginBottom: '60px',
      padding: '20px',
      minHeight: 'calc(100vh - 140px)',
      position: 'relative'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>
        Treasure Hunt
      </h1>

      {!gameStarted ? (
        // Setup panel
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '30px',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>
            Game Setup
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#000'
            }}>
              Time Limit (5-120 seconds):
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Math.min(120, Math.max(5, parseInt(e.target.value) || 5)))}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '2px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#000'
            }}>
              Coin Count (4-40):
            </label>
            <input
              type="number"
              min="4"
              max="40"
              value={coinCount}
              onChange={(e) => setCoinCount(Math.min(40, Math.max(4, parseInt(e.target.value) || 4)))}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '2px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleStartGame}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '18px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            Start Game
          </button>
        </div>
      ) : (
        // Game area
        <div>
          {/* Game stats */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            <div style={{ color: '#000', marginBottom: '10px' }}>
              Time Remaining: {timeRemaining}s
            </div>
            <div style={{ color: '#000' }}>
              Yellow coins found: {yellowCoinsFound} / {totalYellowCoins}
            </div>
          </div>

          {/* Coins */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 350px)',
            minHeight: '400px'
          }}>
            {coins.map(coin => (
              <div
                key={coin.id}
                onClick={() => handleCoinClick(coin.id)}
                style={{
                  position: 'absolute',
                  left: `${coin.x}px`,
                  top: `${coin.y}px`,
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: getCoinColor(coin),
                  border: '3px solid #333',
                  cursor: coin.revealed ? 'default' : 'pointer',
                  transition: 'background-color 0.3s ease',
                  boxShadow: coin.revealed ? '0 0 10px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => {
                  if (!coin.revealed) {
                    e.target.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)'
                }}
              />
            ))}
          </div>

          {/* Reset button */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 25px',
                fontSize: '16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TreasureHunt
