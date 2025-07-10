# OB Exam Review - Interactive Learning Environment

An award-winning, gamified educational platform for mastering Labor & Postpartum Complications.

## Features

- 🎮 Interactive 3D simulations and emergency scenarios
- 🏆 Gamified learning with achievements and leaderboards
- 🧠 Adaptive quizzes with spaced repetition
- 📊 Progress tracking and analytics
- 🎨 Stunning animations and 3D visualizations
- 💊 Interactive medication calculators
- 📱 Fully responsive design
- 🔊 Sound effects and haptic feedback

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Animations**: GSAP, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **State Management**: Zustand
- **Styling**: Styled Components
- **UI Components**: Radix UI
- **Charts**: Chart.js, D3.js
- **Physics**: Matter.js

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Deploy to Vercel
npm run deploy
```

## Sound Files Required

Add these sound files to `public/sounds/`:
- click.mp3
- hover.mp3
- correct.mp3
- incorrect.mp3
- achievement.mp3
- complete.mp3
- alarm.mp3
- heartbeat.mp3
- notification.mp3
- level-up.mp3

## Development

1. VS Code Extensions recommended:
   - ESLint
   - Prettier
   - Error Lens
   - styled-components syntax highlighting

2. Run `npm run dev` to start the development server
3. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The app is configured for deployment on Vercel:

```bash
npm run deploy
```

## License

MIT License - Created with ❤️ for nursing education
