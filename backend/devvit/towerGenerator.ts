import { Theme, getRandomTheme, getThemeByName } from './themes';
import { Chunk, createChunk, getRandomChunkType } from './chunks';

export interface TowerManifest {
  theme: Theme;
  chunks: Chunk[];
  generatedAt: string;
  version: string;
}

export class TowerGenerator {
  private theme: Theme;

  constructor(theme?: Theme) {
    this.theme = theme || getRandomTheme();
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
  }

  generateTower(): TowerManifest {
    const chunks: Chunk[] = [];
    let currentY = 0;
    const overlap = 10; // pixels of overlap between chunks

    for (let i = 0; i < this.theme.chunkCount; i++) {
      const chunkType = getRandomChunkType(this.theme.allowedChunkTypes);
      const position = { x: Math.random() * 300, y: currentY - overlap }; // Random x, stacked y with overlap
      const chunk = createChunk(chunkType, position);

      // Apply theme colorization
      this.applyColorization(chunk);

      chunks.push(chunk);
      currentY += chunk.size.height - overlap;
    }

    return {
      theme: this.theme,
      chunks,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  private applyColorization(chunk: Chunk): void {
    // Apply theme colors to chunk properties
    if (chunk.properties.color) {
      // Simple color mapping - in a real implementation, this could be more sophisticated
      switch (chunk.type) {
        case 'StaticPlatform':
        case 'MovingPlatform':
        case 'TimedPlatform':
        case 'ConveyorPlatform':
          chunk.properties.color = this.theme.colorPalette.primary;
          break;
        case 'JumpPad':
          chunk.properties.color = this.theme.colorPalette.accent;
          break;
        case 'RotatingBeam':
          chunk.properties.color = this.theme.colorPalette.secondary;
          break;
        case 'CheckpointPlatform':
          chunk.properties.color = this.theme.colorPalette.accent;
          break;
      }
    }
  }
}

export function generateDailyTower(): TowerManifest {
  const generator = new TowerGenerator();
  return generator.generateTower();
}

export function generateTowerWithTheme(themeName: string): TowerManifest | null {
  const theme = getThemeByName(themeName);
  if (!theme) return null;
  const generator = new TowerGenerator(theme);
  return generator.generateTower();
}