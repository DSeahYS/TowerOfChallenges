import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import GameCanvas from './components/GameCanvas';
import LeaderboardWidget from './components/LeaderboardWidget';
import { leaderboardService } from './services/leaderboardService';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [finalTime, setFinalTime] = useState<number | null>(null);

  const handlePlayNow = () => {
    setGameStarted(true);
  };

  const handleGameFinish = (time: number) => {
    setFinalTime(time);
  };

  const handleShareToLeaderboard = async () => {
    if (finalTime) {
      try {
        await leaderboardService.submitScore('default-tower', finalTime, 'anonymous-player');
        alert('Score submitted successfully!');
      } catch (error) {
        console.error('Failed to submit score:', error);
        alert('Failed to submit score. It has been saved locally and will be submitted when connection is restored.');
        // Optionally retry pending scores
        setTimeout(() => {
          leaderboardService.retryPendingScores().catch(retryError => {
            console.error('Failed to retry pending scores:', retryError);
          });
        }, 1000);
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!gameStarted ? (
        <SplashScreen onPlayNow={handlePlayNow} />
      ) : (
        <>
          <GameCanvas onGameFinish={handleGameFinish} />
          <LeaderboardWidget towerId="default-tower" />
        </>
      )}
    </div>
  );
};

export default App;