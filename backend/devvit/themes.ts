export interface Theme {
  name: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  chunkCount: number;
  allowedChunkTypes: string[];
  description: string;
}

export const themes: Theme[] = [
  {
    name: 'Volcanic Core',
    colorPalette: {
      primary: '#FF4500',
      secondary: '#8B0000',
      accent: '#FFD700',
      background: '#2F1B14',
    },
    chunkCount: 20,
    allowedChunkTypes: ['StaticPlatform', 'MovingPlatform', 'TimedPlatform', 'ConveyorPlatform', 'JumpPad', 'RotatingBeam', 'CheckpointPlatform'],
    description: 'Fiery obstacles in a volcanic environment.',
  },
  {
    name: 'Ice Caverns',
    colorPalette: {
      primary: '#00BFFF',
      secondary: '#4682B4',
      accent: '#FFFFFF',
      background: '#E0F6FF',
    },
    chunkCount: 18,
    allowedChunkTypes: ['StaticPlatform', 'MovingPlatform', 'TimedPlatform', 'ConveyorPlatform', 'JumpPad', 'RotatingBeam', 'CheckpointPlatform'],
    description: 'Slippery ice platforms and cold challenges.',
  },
  {
    name: 'Neon Abyss',
    colorPalette: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#000000',
    },
    chunkCount: 22,
    allowedChunkTypes: ['StaticPlatform', 'MovingPlatform', 'TimedPlatform', 'ConveyorPlatform', 'JumpPad', 'RotatingBeam', 'CheckpointPlatform'],
    description: 'Glowing neon obstacles in the dark.',
  },
];

export function getThemeByName(name: string): Theme | undefined {
  return themes.find((theme: Theme) => theme.name === name);
}

export function getRandomTheme(): Theme {
  return themes[Math.floor(Math.random() * themes.length)];
}