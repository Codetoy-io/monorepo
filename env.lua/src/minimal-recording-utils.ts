/**
 * Minimal Canvas Recording Utilities
 */

export class CanvasRecorder {
  private canvas: HTMLCanvasElement;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private audioStream: MediaStream | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async start(fps: number = 30, includeAudio: boolean = true): Promise<void> {
    const canvasStream = this.canvas.captureStream(fps);

    // Get mic audio if requested
    if (includeAudio) {
      try {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn('No microphone access:', err);
        this.audioStream = null;
      }
    }

    // Combine streams
    const tracks = [...canvasStream.getVideoTracks()];
    if (this.audioStream) {
      tracks.push(...this.audioStream.getAudioTracks());
    }
    const combinedStream = new MediaStream(tracks);

    // Create recorder
    this.mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm'
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.recordedChunks = [];
    this.mediaRecorder.start(100);
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob());
        return;
      }

      this.mediaRecorder.onstop = () => {
        // wait to make sure we get the next chunk of data
        requestAnimationFrame(() => {
          setTimeout(() => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            
            if (this.audioStream) {
              this.audioStream.getTracks().forEach(track => track.stop());
              this.audioStream = null;
            }
            this.mediaRecorder = null;
            
            resolve(blob);
          }, 200)
        });
      };

      // DO NOT ADD THIS, it breaks stuff?
      // this.mediaRecorder.requestData()

      // stop the recoridng and trigger onstop callback
      this.mediaRecorder.stop();
    });
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}