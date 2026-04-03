import { useState, useEffect } from 'react'

const MathGame = () => {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState('+')
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [message, setMessage] = useState('')

  const operators = ['+', '-', '×', '÷', '%']

  // Generate random number between 1 and 50
  const randomNum = () => Math.floor(Math.random() * 50) + 1

  // Calculate the correct answer
  const calculateAnswer = (a, b, op) => {
    let result
    switch (op) {
      case '+':
        result = a + b
        break
      case '-':
        result = a - b
        break
      case '×':
        result = a * b
        break
      case '÷':
        result = a / b // Floating-point division
        break
      case '%':
        result = a % b
        break
      default:
        result = 0
    }
    
    // Round to 1 decimal place if not an integer
    if (!Number.isInteger(result)) {
      result = Math.round(result * 10) / 10
    }
    
    return result
  }

  // Generate new question
  const generateQuestion = () => {
    const n1 = randomNum()
    const n2 = randomNum()
    const op = operators[Math.floor(Math.random() * operators.length)]
    
    setNum1(n1)
    setNum2(n2)
    setOperator(op)
    setCorrectAnswer(calculateAnswer(n1, n2, op))
    setUserAnswer('')
    setMessage('')
  }

  // Initialize on mount
  useEffect(() => {
    generateQuestion()
  }, [])

  // Handle answer submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (userAnswer.trim() === '') {
      return
    }

    const answer = parseFloat(userAnswer)
    
    // Check if answer is correct (with small tolerance for floating point)
    if (Math.abs(answer - correctAnswer) < 0.01) {
      alert('Correct!')
      
      // Update dashboard tally
      const currentGamesWon = parseInt(localStorage.getItem('gamesWon') || '0', 10)
      localStorage.setItem('gamesWon', (currentGamesWon + 1).toString())
      
      // Generate new question
      generateQuestion()
    } else {
      setMessage('Incorrect, try again')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  // Handle reset
  const handleReset = () => {
    generateQuestion()
  }

  // Handle input change
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value)
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
      <h1 className="game-title">Math Game</h1>

      {/* Equation display */}
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#000',
        fontFamily: 'monospace'
      }}>
        {num1} {operator} {num2} = ?
      </div>

      {/* Error message */}
      {message && (
        <div style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#ffcccc',
          color: '#cc0000',
          borderRadius: '4px',
          fontSize: '16px'
        }}>
          {message}
        </div>
      )}

      {/* Answer form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <input
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          placeholder="Enter your answer"
          style={{
            fontSize: '24px',
            padding: '10px 20px',
            width: '250px',
            textAlign: 'center',
            border: '2px solid #ccc',
            borderRadius: '5px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#ccc'}
          autoFocus
        />

        <button
          type="submit"
          style={{
            padding: '12px 30px',
            fontSize: '18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Submit
        </button>
      </form>

      {/* Reset button */}
      <button
        onClick={handleReset}
        style={{
          marginTop: '30px',
          padding: '10px 25px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
      >
        Reset Game
      </button>
    </div>
  )
}

export default MathGame
