import { Devvit } from '@devvit/public-api';

export async function handleGifShare(gifData: string, filename: string, context: any): Promise<void> {
  try {
    // Store GIF data in Redis for temporary access
    const gifKey = `gif:${Date.now()}:${filename}`;
    await context.redis.set(gifKey, gifData, { expiration: 3600 }); // 1 hour expiration

    // Create a post with the GIF
    const post = await context.reddit.submitPost({
      subredditName: context.subredditName || 'gaming', // Default to r/gaming or use configured subreddit
      title: `Tower of Challenges Run - ${filename}`,
      kind: 'image',
      url: `data:image/gif;base64,${gifData}`, // Direct base64 embedding
    });

    console.log('GIF post created:', post.id);

    // Add a comment with game stats (placeholder for now)
    await context.reddit.submitComment({
      id: post.id,
      text: `🎮 **Tower of Challenges** - Successful run recorded!\n\n` +
            `📊 **Stats:**\n` +
            `- Time: [To be added]\n` +
            `- Score: [To be added]\n\n` +
            `🔗 Play now: [Game URL]\n\n` +
            `#TowerOfChallenges #Gaming`,
    });

  } catch (error) {
    console.error('Failed to handle GIF share:', error);
    throw error;
  }
}

export async function getStoredGif(gifKey: string, context: any): Promise<string | null> {
  try {
    return await context.redis.get(gifKey);
  } catch (error) {
    console.error('Failed to retrieve stored GIF:', error);
    return null;
  }
}