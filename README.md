# 🎮 GameHub — Childhood Games Collection

A frontend-only web app that brings classic childhood games together in one place, built with React and Vite.

## About

GameHub is a collection of timeless games you grew up playing — reimagined in the browser with no downloads, no accounts, and no backend required. Every game runs entirely on the client side. A built-in score system tracks your wins across all games, so your progress persists between sessions.

## Games

| Game | Description |
|---|---|
| **Slido** | Classic sliding puzzle |
| **Tetro** | Tetris-style block stacking |
| **Tic Tac Toe** | 3×3 up to 9×9 grid, two-player |
| **Snake** | Eat food, grow longer, don't crash |
| **Minesweeper** | Clear the field without hitting a mine |
| **2048** | Merge tiles to reach 2048 |
| **Tower of Hanoi** | Move the tower in the fewest moves |
| **Math Game** | Quick mental arithmetic challenges |
| **Memorisation** | Pattern memory across 5 stages |
| **Treasure Hunt** | Follow clues to find the treasure |

## Score System

Wins are recorded globally via `localStorage` under the key `gamesWon`. The running total is displayed in the dashboard so you can track your overall performance across every game.

## Tech Stack

- **React 19** — functional components, hooks
- **React Router v7** — client-side routing with `BrowserRouter`
- **Vite 7** — fast dev server and optimised production build
- **Pure CSS** — dark theme with CSS custom properties, no UI library

## Live Demo

[lolmantran.github.io/Frontend-Game](https://lolmantran.github.io/Frontend-Game/)

## Run Locally

```bash
npm install
npm run dev
```

