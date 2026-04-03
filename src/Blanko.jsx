import { useState, useEffect } from 'react'

const strs = [
  'the fat cats',
  'larger frogs',
  'banana cakes',
  'unsw vs usyd',
  'french toast',
  'hawaii pizza',
  'barack obama',
]

const Blanko = () => {
  const [currentString, setCurrentString] = useState('')
  const [blankIndices, setBlankIndices] = useState([])
  const [inputs, setInputs] = useState({})

  const initializeGame = () => {
    // Pick a random string
    const randomStr = strs[Math.floor(Math.random() * strs.length)]
    setCurrentString(randomStr)

    // Find all non-space character indices
    const nonSpaceIndices = []
    for (let i = 0; i < randomStr.length; i++) {
      if (randomStr[i] !== ' ') {
        nonSpaceIndices.push(i)
      }
    }

    // Pick 3 random non-space indices to blank out
    const shuffled = [...nonSpaceIndices].sort(() => Math.random() - 0.5)
    const blanks = shuffled.slice(0, 3).sort((a, b) => a - b)
    setBlankIndices(blanks)

    // Reset inputs
    setInputs({})
  }

  useEffect(() => {
    initializeGame()
  }, [])

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newInputs = { ...inputs, [index]: value }
      setInputs(newInputs)

      // Check if all 3 inputs are filled
      if (Object.keys(newInputs).length === 3 && blankIndices.every(idx => newInputs[idx])) {
        // Check if all are correct
        const allCorrect = blankIndices.every(idx => newInputs[idx] === currentString[idx])
        
        if (allCorrect) {
          // Update games won in localStorage
          const currentScore = parseInt(localStorage.getItem('gamesWon') || '0', 10)
          localStorage.setItem('gamesWon', (currentScore + 1).toString())
          
          alert('Correct!')
          initializeGame()
        }
      }
    }
  }

  const renderCharacter = (char, index) => {
    if (blankIndices.includes(index)) {
      return (
        <input
          key={index}
          type="text"
          value={inputs[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          className="blanko-input"
          maxLength={1}
        />
      )
    }
    return <span key={index} className="blanko-char">{char}</span>
  }

  return (
    <div className="main-body">
      <div className="blanko-container">
        <h1 className="game-title">Blanko</h1>
        <div className="blanko-boxes">
          {currentString.split('').map((char, index) => (
            <div key={index} className="blanko-box">
              {renderCharacter(char, index)}
            </div>
          ))}
        </div>
        <button className="blanko-reset-button" onClick={initializeGame}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default Blanko
