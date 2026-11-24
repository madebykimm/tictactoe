# 🎮 Tic-Tac-Toe Game

A stylish, interactive, and feature-rich Tic-Tac-Toe game crafted with themes, sound effects, AI matchmaking, and live score tracking.

---

## ✨ Features

### 1. Core Mechanics
- 🎯 **3×3 Responsive Grid**: Smooth tactile interactions with hover ghost-previews of each player's mark.
- 🔁 **Turn-Based System**: Alternate turns between Player 1 and Player 2 with glowing turn indicators.
- 🏆 **Win & Draw Detection**: Instantly detects 3-in-a-row (rows, columns, diagonals) or stalemates, highlighting the winning combination with glowing animations.
- 🔄 **New Game Button**: Resets the board for an immediate rematch.

### 2. Personality & Themes (Make It Yours!)
Switch between 5 creative themes on the fly:
- ⚡ **Cyber Neon**: Neon Cyan (`✕`) vs Neon Pink (`◯`) with glowing synthwave aesthetics.
- 🚀 **Cosmic Battle**: Astronaut Rocket (`🚀`) vs Alien Invaders (`👾`) in deep space.
- 🍕 **Snack Attack**: Team Pizza (`🍕`) vs Team Burger (`🍔`).
- 🐾 **Paws & Claws**: Cat Squad (`🐱`) vs Dog Squad (`🐶`).
- 🔥 **Arcade Elements**: Voltage (`⚡`) vs Blaze (`🔥`).

### 3. Extra Bonuses & Superpowers
- 🤖 **Single-Player vs AI Mode**:
  - **Chill (Easy)**: Casual, relaxed play.
  - **Smart (Medium)**: Blocks immediate opponent wins and capitalizes on mistakes.
  - **Master (Unbeatable)**: Full Minimax algorithm implementation with depth penalty.
- 📊 **Dynamic Scoreboard**:
  - Tracks Player 1 wins, Player 2 / CPU wins, and Draws.
  - Streak tracking (current win streak and best streak).
  - Scores persist across reloads via `localStorage`.
- 🔊 **Zero-Dependency Sound Synthesizer**:
  - Procedural sound effects powered by the Web Audio API (cell placements, victory fanfares, draw wobbles, button clicks).
  - Audio mute/unmute toggle included.
- 🎉 **Celebration & Polish**:
  - Confetti burst on victory via `canvas-confetti`.
  - Move undo support.
  - Keyboard accessible (`Tab`, `Space`, `Enter`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **FX**: `canvas-confetti`, Web Audio API

---

## 🚀 Getting Started

### Prerequisites
Node.js 20+ installed.

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification

```bash
npm run lint
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

The application is pre-configured and optimized for 1-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into your Vercel Dashboard.
3. Deploy! Next.js will automatically detect settings and deploy static pages with edge speed.
