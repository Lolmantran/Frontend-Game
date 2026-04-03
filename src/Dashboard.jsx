import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const games = [
  { path: '/slido', label: 'Slido', icon: '🔀', desc: 'Sliding puzzle' },
  { path: '/tetro', label: 'Tetro', icon: '🟦', desc: 'Block stacking' },
  { path: '/tictactoe', label: 'Tic Tac Toe', icon: '❌', desc: 'Classic X vs O' },
  { path: '/snake', label: 'Snake', icon: '🐍', desc: 'Eat & grow' },
  { path: '/minesweeper', label: 'Minesweeper', icon: '💣', desc: 'Find the mines' },
  { path: '/2048', label: '2048', icon: '🔢', desc: 'Merge tiles' },
  { path: '/hanoi', label: 'Tower of Hanoi', icon: '🗼', desc: 'Move the disks' },
  { path: '/math', label: 'Math Game', icon: '➕', desc: 'Number challenge' },
  { path: '/memorisation', label: 'Memorisation', icon: '🧠', desc: 'Test your memory' },
  { path: '/treasure', label: 'Treasure Hunt', icon: '🗺️', desc: 'Find the treasure' },
]

const Dashboard = () => {
  const [gamesWon, setGamesWon] = useState(0)

  useEffect(() => {
    const initializeScore = async () => {
      const storedScore = localStorage.getItem('gamesWon')

      if (storedScore === null) {
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
      localStorage.setItem('gamesWon', 0)
      setGamesWon(0)
    } catch (error) {
      console.error('Error fetching reset score:', error)
      localStorage.setItem('gamesWon', '0')
      setGamesWon(0)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <h1 className="dashboard-title">Game Hub</h1>
        <p className="dashboard-subtitle">Choose a game and start playing</p>
        <div className="dashboard-score-badge">
          🏆 Games won: {gamesWon}
          <button className="reset-button" onClick={handleReset}>(reset)</button>
        </div>
      </div>

      <div className="games-grid">
        {games.map(({ path, label, icon, desc }) => (
          <Link key={path} to={path} className="game-card">
            <span className="game-card-icon">{icon}</span>
            <span className="game-card-name">{label}</span>
            <span className="game-card-desc">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
