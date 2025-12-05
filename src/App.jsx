import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Dashboard from './Dashboard.jsx'
import Blanko from './Blanko.jsx'
import Slido from './Slido.jsx'
import Tetro from './Tetro.jsx'
import TicTacToe from './TicTacToe.jsx'
import Snake from './Snake.jsx'
import Minesweeper from './Minesweeper.jsx'
import Game2048 from './Game2048.jsx'

function App() {
  return (
    <BrowserRouter>
      <div style={{ margin: 0 }}>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/slido" element={<Slido />} />
          <Route path="/tetro" element={<Tetro />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/snake" element={<Snake />} />
          <Route path="/minesweeper" element={<Minesweeper />} />
          <Route path="/2048" element={<Game2048 />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
