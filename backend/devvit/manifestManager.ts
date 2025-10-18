import { TowerManifest } from './towerGenerator';

export class ManifestManager {
  private static instance: ManifestManager;
  private currentManifest: TowerManifest | null = null;
  private manifestHistory: TowerManifest[] = [];

  private constructor() {}

  static getInstance(): ManifestManager {
    if (!ManifestManager.instance) {
      ManifestManager.instance = new ManifestManager();
    }
    return ManifestManager.instance;
  }

  setCurrentManifest(manifest: TowerManifest): void {
    this.currentManifest = manifest;
    this.manifestHistory.push(manifest);
    // Keep only last 30 days of history
    if (this.manifestHistory.length > 30) {
      this.manifestHistory.shift();
    }
  }

  getCurrentManifest(): TowerManifest | null {
    return this.currentManifest;
  }

  getManifestHistory(): TowerManifest[] {
    return this.manifestHistory;
  }

  exportManifest(): string {
    if (!this.currentManifest) {
      throw new Error('No current manifest available');
    }
    return JSON.stringify(this.currentManifest, null, 2);
  }

  importManifest(jsonString: string): void {
    try {
      const manifest: TowerManifest = JSON.parse(jsonString);
      this.setCurrentManifest(manifest);
    } catch (error) {
      throw new Error('Invalid manifest JSON');
    }
  }
}

export function getTowerManifest(): string {
  const manager = ManifestManager.getInstance();
  return manager.exportManifest();
}

export function setTowerManifest(manifest: TowerManifest): void {
  const manager = ManifestManager.getInstance();
  manager.setCurrentManifest(manifest);
}