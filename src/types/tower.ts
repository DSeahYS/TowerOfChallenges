export interface TowerManifest {
  theme: Theme;
  chunks: Chunk[];
  generatedAt: string;
  version: string;
}

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

export interface Chunk {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
}