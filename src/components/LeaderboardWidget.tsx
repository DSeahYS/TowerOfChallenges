import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboardService';

interface Score {
  TowerID: string;
  Score: number;
  PlayerID: string;
  Timestamp: string;
}

interface LeaderboardWidgetProps {
  towerId: string;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ towerId }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const scoresData = await leaderboardService.getScores(towerId);
      setScores(scoresData.slice(0, 10)); // Top 10 scores
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch leaderboard scores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, [towerId]);

  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '1rem',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 100
      }}>
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '1rem',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 100
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '1rem',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '300px',
      zIndex: 100
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Leaderboard</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {scores.length === 0 ? (
          <p>No scores yet!</p>
        ) : (
          scores.map((score, index) => (
            <div key={score.Timestamp} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: index < scores.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}>
              <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
              <span>{score.PlayerID}</span>
              <span>{score.Score.toFixed(2)}s</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardWidget;