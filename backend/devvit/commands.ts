import { generateTowerWithTheme } from './towerGenerator';
import { setTowerManifest } from './manifestManager';
import { getThemeByName } from './themes';
import { recordVote } from './voting';

export function handleSlashCommand(comment: any, context: any): void {
  const body = comment.body.toLowerCase();

  if (body.startsWith('/towerset')) {
    const parts = body.split(' ');
    if (parts.length < 3) {
      // Reply with usage instructions
      context.reddit.submitComment({
        id: comment.id,
        text: 'Usage: /towerset <type> theme="<theme_name>"\nTypes: daily, weekly\nExample: /towerset weekly theme="Ice Caverns"',
      });
      return;
    }

    const type = parts[1];
    const themeMatch = body.match(/theme="([^"]+)"/);
    if (!themeMatch) {
      context.reddit.submitComment({
        id: comment.id,
        text: 'Please specify a theme in quotes: theme="Theme Name"',
      });
      return;
    }

    const themeName = themeMatch[1];
    const theme = getThemeByName(themeName);
    if (!theme) {
      context.reddit.submitComment({
        id: comment.id,
        text: `Theme "${themeName}" not found. Available themes: Volcanic Core, Ice Caverns, Neon Abyss`,
      });
      return;
    }

    if (type === 'daily' || type === 'weekly') {
      const manifest = generateTowerWithTheme(themeName);
      if (manifest) {
        setTowerManifest(manifest);
        context.reddit.submitComment({
          id: comment.id,
          text: `Successfully set ${type} tower theme to "${themeName}". The new tower will be generated at the next scheduled time.`,
        });
      } else {
        context.reddit.submitComment({
          id: comment.id,
          text: 'Failed to generate tower with the specified theme.',
        });
      }
    } else {
      context.reddit.submitComment({
        id: comment.id,
        text: 'Invalid type. Use "daily" or "weekly".',
      });
    }
  }
}

export function handleVoteCommand(comment: any, context: any): void {
  const body = comment.body.toLowerCase();

  if (body.startsWith('/vote')) {
    const parts = body.split(' ');
    if (parts.length < 2) {
      context.reddit.submitComment({
        id: comment.id,
        text: 'Usage: /vote <theme_name>\nExample: /vote "Ice Caverns"',
      });
      return;
    }

    const themeName = parts.slice(1).join(' ').replace(/"/g, '');
    const userId = comment.authorId || comment.author; // Use appropriate user identifier

    const success = recordVote(userId, themeName);
    if (success) {
      context.reddit.submitComment({
        id: comment.id,
        text: `Your vote for "${themeName}" has been recorded! Community voting helps determine future weekly themes.`,
      });
    } else {
      context.reddit.submitComment({
        id: comment.id,
        text: 'You have already voted this week. You can only vote once per week.',
      });
    }
  }
}