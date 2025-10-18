import CanvasCapture from 'canvas-capture';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export class CanvasCaptureService {
  private static instance: CanvasCaptureService;
  private canvas: HTMLCanvasElement | null = null;
  private isRecording = false;
  private capture: any = null;

  private constructor() {}

  static getInstance(): CanvasCaptureService {
    if (!CanvasCaptureService.instance) {
      CanvasCaptureService.instance = new CanvasCaptureService();
    }
    return CanvasCaptureService.instance;
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    CanvasCapture.init(canvas, {
      showRecDot: true,
      showDialogs: true,
      showAlerts: true,
    });
  }

  startRecording(): void {
    if (!this.canvas || this.isRecording) return;

    try {
      this.capture = CanvasCapture.beginGIFRecord({
        name: `TowerOfChallenges_${Date.now()}`,
        fps: 30,
        quality: 0.8,
        onExport: (blob: Blob, filename: string) => {
          console.log('GIF exported:', filename);
          // Store the blob for sharing
          this.handleGifGenerated(blob, filename);
        },
        onExportFinish: () => {
          console.log('GIF export finished');
          this.isRecording = false;
        },
        onError: (error: any) => {
          console.error('GIF recording error:', error);
          this.isRecording = false;
          // Fallback: show error message to user
          this.showRecordingError();
        },
      });
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start GIF recording:', error);
      this.showRecordingError();
    }
  }

  private showRecordingError(): void {
    // Could show a toast notification or fallback UI
    console.warn('GIF recording failed - gameplay will continue without recording');
  }

  recordFrame(): void {
    if (this.isRecording) {
      CanvasCapture.recordFrame(this.capture);
    }
  }

  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording || !this.capture) return null;

    try {
      await CanvasCapture.stopRecord(this.capture);
      // The GIF will be handled in the onExport callback
      return new Promise((resolve) => {
        const checkRecording = () => {
          if (!this.isRecording) {
            resolve(this.lastGeneratedGif);
          } else {
            setTimeout(checkRecording, 100);
          }
        };
        checkRecording();
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.isRecording = false;
      return null;
    }
  }

  private lastGeneratedGif: Blob | null = null;

  private handleGifGenerated(blob: Blob, filename: string): void {
    this.lastGeneratedGif = blob;
    // Trigger sharing flow
    this.shareGif(blob, filename);
  }

  private async shareGif(blob: Blob, filename: string): Promise<void> {
    try {
      // Convert blob to base64 for sharing
      const base64 = await this.blobToBase64(blob);

      // Store in Firebase Firestore
      const gifsRef = collection(db, 'sharedGifs');
      await addDoc(gifsRef, {
        gifData: base64,
        filename,
        gameType: 'TowerOfChallenges',
        sharedAt: new Date().toISOString(),
      });

      console.log('GIF shared successfully to Firebase');
    } catch (error) {
      console.error('Failed to share GIF:', error);
      // Fallback: store locally for later sharing
      this.storeGifLocally(blob, filename);
    }
  }

  private storeGifLocally(blob: Blob, filename: string): void {
    try {
      // Convert blob to base64 and store in localStorage
      this.blobToBase64(blob).then(base64 => {
        const pendingGifs = JSON.parse(localStorage.getItem('pendingGifs') || '[]');
        pendingGifs.push({ base64, filename, timestamp: Date.now() });
        localStorage.setItem('pendingGifs', JSON.stringify(pendingGifs));
        console.log('GIF stored locally for later sharing');
      });
    } catch (error) {
      console.error('Failed to store GIF locally:', error);
    }
  }

  async retryPendingGifs(): Promise<void> {
    try {
      const pendingGifs = JSON.parse(localStorage.getItem('pendingGifs') || '[]');
      const successfulShares: any[] = [];

      for (const gifData of pendingGifs) {
        try {
          // Try to share to Firebase Firestore
          const gifsRef = collection(db, 'sharedGifs');
          await addDoc(gifsRef, {
            gifData: gifData.base64,
            filename: gifData.filename,
            gameType: 'TowerOfChallenges',
            sharedAt: new Date().toISOString(),
          });
          successfulShares.push(gifData);
        } catch (error) {
          console.error('Failed to retry GIF sharing:', error);
        }
      }

      // Remove successfully shared GIFs
      const remainingGifs = pendingGifs.filter((gif: any) =>
        !successfulShares.some((shared: any) =>
          shared.filename === gif.filename && shared.timestamp === gif.timestamp
        )
      );
      localStorage.setItem('pendingGifs', JSON.stringify(remainingGifs));
    } catch (error) {
      console.error('Failed to retry pending GIFs:', error);
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/gif;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

export const canvasCaptureService = CanvasCaptureService.getInstance();