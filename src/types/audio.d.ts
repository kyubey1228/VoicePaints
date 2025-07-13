// Web Audio API の型定義拡張
interface Window {
  webkitAudioContext?: typeof AudioContext;
}

// MediaRecorder の型定義
declare global {
  interface MediaRecorderOptions {
    mimeType?: string;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    bitsPerSecond?: number;
  }
}

export {};
