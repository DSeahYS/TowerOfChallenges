import { Theme } from './themes';

export interface Vote {
  userId: string;
  themeName: string;
  timestamp: number;
}

export class VotingSystem {
  private static instance: VotingSystem;
  private votes: Vote[] = [];
  private weeklyThemeVotes: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): VotingSystem {
    if (!VotingSystem.instance) {
      VotingSystem.instance = new VotingSystem();
    }
    return VotingSystem.instance;
  }

  addVote(userId: string, themeName: string): boolean {
    // Check if user already voted this week
    const weekStart = this.getWeekStart();
    const existingVote = this.votes.find(vote =>
      vote.userId === userId &&
      vote.timestamp >= weekStart
    );

    if (existingVote) {
      return false; // User already voted this week
    }

    const vote: Vote = {
      userId,
      themeName,
      timestamp: Date.now(),
    };

    this.votes.push(vote);
    this.updateWeeklyVotes(themeName);
    return true;
  }

  private updateWeeklyVotes(themeName: string): void {
    const currentCount = this.weeklyThemeVotes.get(themeName) || 0;
    this.weeklyThemeVotes.set(themeName, currentCount + 1);
  }

  getWeeklyVoteResults(): { themeName: string; votes: number }[] {
    return Array.from(this.weeklyThemeVotes.entries())
      .map(([themeName, votes]) => ({ themeName, votes }))
      .sort((a, b) => b.votes - a.votes);
  }

  getWinningTheme(): string | null {
    const results = this.getWeeklyVoteResults();
    return results.length > 0 ? results[0].themeName : null;
  }

  resetWeeklyVotes(): void {
    this.weeklyThemeVotes.clear();
    // Remove old votes (older than 1 week)
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.votes = this.votes.filter(vote => vote.timestamp >= weekAgo);
  }

  private getWeekStart(): number {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday
    const diff = now.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000);
    return new Date(diff).setHours(0, 0, 0, 0);
  }

  getVoteCount(themeName: string): number {
    return this.weeklyThemeVotes.get(themeName) || 0;
  }
}

export function recordVote(userId: string, themeName: string): boolean {
  const votingSystem = VotingSystem.getInstance();
  return votingSystem.addVote(userId, themeName);
}

export function getWeeklyWinner(): string | null {
  const votingSystem = VotingSystem.getInstance();
  return votingSystem.getWinningTheme();
}

export function resetVoting(): void {
  const votingSystem = VotingSystem.getInstance();
  votingSystem.resetWeeklyVotes();
}