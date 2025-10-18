import { Devvit, ScheduledJobEvent } from '@devvit/public-api';
import { generateDailyTower, generateTowerWithTheme } from './towerGenerator';
import { setTowerManifest } from './manifestManager';
import { getWeeklyWinner, resetVoting } from './voting';

Devvit.addScheduledJob({
  name: 'dailyTowerGeneration',
  schedule: '0 0 * * *', // Daily at 00:00 UTC
  onRun: async (event: ScheduledJobEvent, context) => {
    // Generate new daily tower
    const manifest = generateDailyTower();
    setTowerManifest(manifest);

    // Logic to post "Today's Tower is Live!" on Reddit
    const subreddit = await context.reddit.getSubredditByName('towerofchallenges'); // Replace with actual subreddit
    await subreddit.submitPost({
      title: "Today's Tower is Live!",
      text: `Challenge yourself with today's tower themed "${manifest.theme.name}"! Submit your scores in the comments.`,
    });
    console.log('Daily tower generated and post created');
  },
});

Devvit.addScheduledJob({
  name: 'weeklyTowerGeneration',
  schedule: '0 0 * * 1', // Weekly on Monday at 00:00 UTC
  onRun: async (event: ScheduledJobEvent, context) => {
    // Get community-voted winning theme
    const winningTheme = getWeeklyWinner();
    let manifest;

    if (winningTheme) {
      // Generate tower with winning theme
      manifest = generateTowerWithTheme(winningTheme);
    } else {
      // Fallback to random theme
      manifest = generateDailyTower();
    }

    if (manifest) {
      setTowerManifest(manifest);

      // Post weekly tower announcement
      const subreddit = await context.reddit.getSubredditByName('towerofchallenges');
      await subreddit.submitPost({
        title: "Weekly Tower is Live!",
        text: `This week's community-voted tower themed "${manifest.theme.name}" is now live! Thanks to everyone who voted.`,
      });
      console.log('Weekly tower generated and post created');
    }

    // Reset voting for next week
    resetVoting();
  },
});

Devvit.addScheduledJob({
  name: 'lockComments',
  schedule: '0 */1 * * *', // Every hour
  onRun: async (event: ScheduledJobEvent, context) => {
    // Logic to lock comment threads after a set time (e.g., 24 hours)
    const posts = await context.reddit.getPosts({ subreddit: 'towerofchallenges', limit: 10 }); // Adjust as needed
    const now = Date.now();
    const lockTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    for (const post of posts) {
      if (now - post.createdAt.getTime() > lockTime) {
        await post.lock();
        console.log(`Locked comments for post: ${post.id}`);
      }
    }
  },
});