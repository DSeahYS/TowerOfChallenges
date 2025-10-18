# Tower of Challenges

A physics-based tower-building game where players compete to build the tallest, most stable tower using various challenge pieces. Features real-time physics simulation, scoring system, and Reddit integration for community challenges.

## Features

- **Physics-Based Gameplay**: Built with Matter.js for realistic physics simulation
- **3D Visualization**: Three.js-powered 3D rendering with WebGL
- **Reddit Integration**: Devvit-powered Reddit app for community challenges and leaderboards
- **Score Tracking**: Firebase Functions backend with Firestore storage
- **GIF Sharing**: Automatic GIF generation and sharing of successful builds
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Three.js for 3D rendering
- Matter.js for physics simulation
- TypeScript
- Vite for build tooling

### Backend
- Firebase Functions (Node.js)
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

### Reddit Integration
- Devvit framework
- Reddit API integration

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project set up
- Reddit app credentials (for Devvit)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Project Structure

```
TowerOfChallenges/
├── src/                    # Frontend React application
├── backend/
│   ├── functions/         # Firebase Functions
│   └── devvit/            # Reddit Devvit applications
├── tests/                 # Test files
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── specs.yml             # Component specifications
├── steering.yml          # Deployment orchestration
├── hooks.yml             # Test hooks
└── package.json
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Reddit API (for Devvit)
REDDIT_CLIENT_ID=your-client-id
REDDIT_CLIENT_SECRET=your-client-secret
REDDIT_USERNAME=your-username
REDDIT_PASSWORD=your-password

# Firestore Collection
FIRESTORE_COLLECTION=TowerScores

# Firebase Storage Bucket
FIREBASE_STORAGE_BUCKET=tower-challenges-gifs
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.