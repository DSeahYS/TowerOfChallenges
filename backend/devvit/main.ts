import { Devvit } from '@devvit/public-api';
import { parseScoreFromComment, validateScore } from './scoreValidator';
import { handleSlashCommand, handleVoteCommand } from './commands';
import { handleGifShare } from './gifHandler';
import * as admin from 'firebase-admin';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || '',
  });
}

const db = admin.firestore();

Devvit.addTrigger({
  event: 'PostSubmit',
  onEvent: async (event) => {
    // Logic for handling new posts
    console.log('New post submitted:', event.post?.id);
  },
});

Devvit.addTrigger({
  event: 'CommentSubmit',
  onEvent: async (event: any, context: any) => {
    // Logic for handling new comments and validating scores
    console.log('New comment submitted:', event.commentId);

    const comment = await context.reddit.getCommentById(event.commentId);

    // Check for slash commands first
    if (comment.body.startsWith('/')) {
      if (comment.body.toLowerCase().startsWith('/towerset')) {
        handleSlashCommand(comment, context);
        return;
      } else if (comment.body.toLowerCase().startsWith('/vote')) {
        handleVoteCommand(comment, context);
        return;
      }
    }

    const score = parseScoreFromComment(comment);
    if (score !== null && validateScore(score)) {
      // Submit score to Firestore
      try {
        const userId = comment.author.name; // Assuming Reddit username as user ID
        const docRef = db.collection('scores').doc(userId);
        await docRef.set({
          score: score,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          commentId: comment.id,
        }, { merge: true });
        console.log('Score submitted to Firestore:', score);
      } catch (error) {
        console.error('Error submitting score to Firestore:', error);
      }
    } else {
      console.log('Invalid or no score in comment');
    }
  },
});

// Add trigger for handling GIF shares
Devvit.addTrigger({
  event: 'AppInstall', // This could be changed to a custom event or webhook
  onEvent: async () => {
    // This is a placeholder - in reality, GIF sharing would be triggered via API
    console.log('App installed or GIF share triggered');
  },
});

export default Devvit;