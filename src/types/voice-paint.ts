// Voice Paint アプリケーションの型定義

export interface CanvasSize {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface AudioAnalysisResult {
  volume: number;
  frequency: number;
  maxValue: number;
}

export interface DrawingConfig {
  brushColor: string;
  lineWidth: number;
  opacity: number;
}

export interface VoiceVisualizationState {
  isRecording: boolean;
  isDrawing: boolean;
  currentFrequency: number;
  currentVolume: number;
}

export enum FrequencyRange {
  HIGH = 'high',    // > 400Hz
  MEDIUM = 'medium', // 200-400Hz
  LOW = 'low'       // < 200Hz
}

export interface AudioProcessingConfig {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
}

export const DEFAULT_AUDIO_CONFIG: AudioProcessingConfig = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10
};

export const DRAWING_CONSTANTS = {
  MIN_VOLUME_THRESHOLD: 0.005,
  MIN_FREQUENCY_VALUE: 10,
  MAX_LINE_WIDTH: 20,
  MIN_LINE_WIDTH: 1,
  VOLUME_MULTIPLIER: 10,
  FREQUENCY_DIVISOR: 100,
  MOVEMENT_MULTIPLIER: 100,
  HIGH_FREQUENCY_THRESHOLD: 400,
  MEDIUM_FREQUENCY_THRESHOLD: 200
} as const;