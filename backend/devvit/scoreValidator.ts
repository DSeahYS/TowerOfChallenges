import { Comment } from '@devvit/public-api';

export function parseScoreFromComment(comment: Comment): number | null {
  // Assuming scores are posted in a specific format, e.g., "Score: 12345"
  const scoreRegex = /Score:\s*(\d+)/i;
  const match = comment.body.match(scoreRegex);
  if (match) {
    const score = parseInt(match[1], 10);
    return isNaN(score) ? null : score;
  }
  return null;
}

export function validateScore(score: number): boolean {
  // Basic validation: score should be positive and within reasonable bounds
  return score > 0 && score <= 1000000; // Adjust bounds as needed
}