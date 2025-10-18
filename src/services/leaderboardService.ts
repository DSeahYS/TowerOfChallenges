import { collection, query, orderBy, limit, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

interface Score {
  TowerID: string;
  Score: number;
  PlayerID: string;
  Timestamp: string;
}

export class LeaderboardService {
  private static instance: LeaderboardService;

  private constructor() {}

  static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  async getScores(towerId: string): Promise<Score[]> {
    try {
      const scoresRef = collection(db, 'scores');
      const q = query(
        scoresRef,
        where('TowerID', '==', towerId),
        orderBy('Score', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const scores: Score[] = [];
      querySnapshot.forEach((doc) => {
        scores.push(doc.data() as Score);
      });
      return scores;
    } catch (error) {
      console.error('Error fetching scores:', error);
      // Return empty array as fallback for offline/error scenarios
      return [];
    }
  }

  async submitScore(towerId: string, score: number, playerId: string): Promise<void> {
    try {
      const scoresRef = collection(db, 'scores');
      await addDoc(scoresRef, {
        TowerID: towerId,
        Score: score,
        PlayerID: playerId,
        Timestamp: new Date().toISOString(),
      });
      console.log('Score submitted successfully');
    } catch (error) {
      console.error('Error submitting score:', error);
      // Store locally for retry later (could implement local storage fallback)
      this.storeScoreLocally(towerId, score, playerId);
      throw error;
    }
  }

  private storeScoreLocally(towerId: string, score: number, playerId: string): void {
    try {
      const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
      pendingScores.push({ towerId, score, playerId, timestamp: Date.now() });
      localStorage.setItem('pendingScores', JSON.stringify(pendingScores));
    } catch (error) {
      console.error('Failed to store score locally:', error);
    }
  }

  async retryPendingScores(): Promise<void> {
    try {
      const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
      const successfulSubmissions: any[] = [];

      for (const scoreData of pendingScores) {
        try {
          await this.submitScore(scoreData.towerId, scoreData.score, scoreData.playerId);
          successfulSubmissions.push(scoreData);
        } catch (error) {
          console.error('Failed to retry score submission:', error);
        }
      }

      // Remove successfully submitted scores
      const remainingScores = pendingScores.filter((score: any) =>
        !successfulSubmissions.some((submitted: any) =>
          submitted.towerId === score.towerId &&
          submitted.score === score.score &&
          submitted.playerId === score.playerId
        )
      );
      localStorage.setItem('pendingScores', JSON.stringify(remainingScores));
    } catch (error) {
      console.error('Failed to retry pending scores:', error);
    }
  }
}

export const leaderboardService = LeaderboardService.getInstance();