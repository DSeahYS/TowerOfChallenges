export interface Chunk {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
}

export const chunkDefinitions: Record<string, Partial<Chunk>> = {
  StaticPlatform: {
    type: 'StaticPlatform',
    size: { width: 100, height: 20 },
    properties: { color: '#FFFFFF' },
  },
  MovingPlatform: {
    type: 'MovingPlatform',
    size: { width: 100, height: 20 },
    properties: {
      color: '#FFFFFF',
      movement: { direction: 'horizontal', speed: 50, range: 200 },
    },
  },
  TimedPlatform: {
    type: 'TimedPlatform',
    size: { width: 100, height: 20 },
    properties: {
      color: '#FFFFFF',
      duration: 3000, // milliseconds
      disappearTime: 2000,
    },
  },
  ConveyorPlatform: {
    type: 'ConveyorPlatform',
    size: { width: 100, height: 20 },
    properties: {
      color: '#FFFFFF',
      direction: 'right',
      speed: 100,
    },
  },
  JumpPad: {
    type: 'JumpPad',
    size: { width: 50, height: 10 },
    properties: {
      color: '#00FF00',
      jumpForce: 300,
    },
  },
  RotatingBeam: {
    type: 'RotatingBeam',
    size: { width: 200, height: 10 },
    properties: {
      color: '#FF0000',
      rotationSpeed: 2, // radians per second
      pivot: { x: 0, y: 0 },
    },
  },
  CheckpointPlatform: {
    type: 'CheckpointPlatform',
    size: { width: 100, height: 20 },
    properties: {
      color: '#FFFF00',
      checkpointId: 0,
    },
  },
};

export function createChunk(type: string, position: { x: number; y: number }): Chunk {
  const definition = chunkDefinitions[type];
  if (!definition) {
    throw new Error(`Unknown chunk type: ${type}`);
  }
  return {
    ...definition,
    position,
  } as Chunk;
}

export function getRandomChunkType(allowedTypes: string[]): string {
  return allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
}