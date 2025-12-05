import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [gamesWon, setGamesWon] = useState(0)

  useEffect(() => {
    const initializeScore = async () => {
      const storedScore = localStorage.getItem('gamesWon')
      
      if (storedScore === null) {
        // First time load - fetch from API
        try {
          const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json')
          const data = await response.json()
          const initialScore = data.score
          localStorage.setItem('gamesWon', initialScore)
          setGamesWon(initialScore)
        } catch (error) {
          console.error('Error fetching initial score:', error)
          localStorage.setItem('gamesWon', '0')
          setGamesWon(0)
        }
      } else {
        setGamesWon(parseInt(storedScore, 10))
      }
    }

    initializeScore()
  }, [])

  const handleReset = async () => {
    try {
      const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json')
      const data = await response.json()
      const resetScore = data.score
      localStorage.setItem('gamesWon', resetScore)
      setGamesWon(resetScore)
    } catch (error) {
      console.error('Error fetching reset score:', error)
      localStorage.setItem('gamesWon', '0')
      setGamesWon(0)
    }
  }

  return (
    <div className="dashboard-container">
      <p className="dashboard-title">Please choose an option from the navbar</p>
      <p className="dashboard-score">
        Games won: {gamesWon} <button className="reset-button" onClick={handleReset}>(reset)</button>
      </p>
    </div>
  )
}

export default Dashboard
