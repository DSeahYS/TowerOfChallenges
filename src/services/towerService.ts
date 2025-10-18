import { TowerManifest, Chunk } from '../types/tower';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export class TowerService {
  private static instance: TowerService;
  private currentManifest: TowerManifest | null = null;

  private constructor() {}

  static getInstance(): TowerService {
    if (!TowerService.instance) {
      TowerService.instance = new TowerService();
    }
    return TowerService.instance;
  }

  async loadTowerManifest(): Promise<TowerManifest> {
    try {
      // Try to fetch from Firebase Firestore first
      const manifestsRef = collection(db, 'towerManifests');
      const q = query(manifestsRef, orderBy('generatedAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const manifest: TowerManifest = doc.data() as TowerManifest;
        this.currentManifest = manifest;
        return manifest;
      }

      // If no manifest in Firestore, fall back to default
      throw new Error('No manifest found in Firestore');
    } catch (error) {
      console.error('Failed to load tower manifest:', error);
      // Fallback to a default manifest
      return this.getDefaultManifest();
    }
  }

  getCurrentManifest(): TowerManifest | null {
    return this.currentManifest;
  }

  private getDefaultManifest(): TowerManifest {
    // Create a simple default manifest for fallback
    const defaultChunks: Chunk[] = [
      {
        type: 'StaticPlatform',
        position: { x: -100, y: 300 },
        size: { width: 100, height: 10 },
        properties: { color: '#FFD700' },
      },
      {
        type: 'StaticPlatform',
        position: { x: 100, y: 250 },
        size: { width: 100, height: 10 },
        properties: { color: '#228B22' },
      },
      {
        type: 'CheckpointPlatform',
        position: { x: -50, y: 200 },
        size: { width: 80, height: 10 },
        properties: { color: '#FFD700' },
      },
      {
        type: 'StaticPlatform',
        position: { x: 50, y: 150 },
        size: { width: 80, height: 10 },
        properties: { color: '#228B22' },
      },
      {
        type: 'CheckpointPlatform',
        position: { x: 0, y: 100 },
        size: { width: 60, height: 10 },
        properties: { color: '#FFD700' },
      },
    ];

    return {
      theme: {
        name: 'Default',
        colorPalette: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          accent: '#FFD700',
          background: '#87CEEB',
        },
        chunkCount: 5,
        allowedChunkTypes: ['StaticPlatform', 'CheckpointPlatform'],
        description: 'Default tower configuration',
      },
      chunks: defaultChunks,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}

export const towerService = TowerService.getInstance();