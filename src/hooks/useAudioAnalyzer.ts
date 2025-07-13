import { useRef, useCallback } from 'react';
import { AudioAnalysisResult, DEFAULT_AUDIO_CONFIG } from '../types/voice-paint';

export const useAudioAnalyzer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initializeAudio = useCallback(async (): Promise<MediaStream> => {
    try {
      // マイクアクセスを要求
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // AudioContext の作成
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // サスペンド状態の場合は再開
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // ソースとアナライザーの設定
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // アナライザーの設定
      analyserRef.current.fftSize = DEFAULT_AUDIO_CONFIG.fftSize;
      analyserRef.current.smoothingTimeConstant = DEFAULT_AUDIO_CONFIG.smoothingTimeConstant;
      analyserRef.current.minDecibels = DEFAULT_AUDIO_CONFIG.minDecibels;
      analyserRef.current.maxDecibels = DEFAULT_AUDIO_CONFIG.maxDecibels;
      
      source.connect(analyserRef.current);
      streamRef.current = stream;

      return stream;
    } catch (error) {
      throw error;
    }
  }, []);

  const analyzeAudio = useCallback((): AudioAnalysisResult | null => {
    if (!analyserRef.current) return null;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const frequencyArray = new Uint8Array(bufferLength);
    
    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(frequencyArray);

    // 音量計算（RMS）
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const value = (dataArray[i] - 128) / 128;
      sum += value * value;
    }
    const volume = Math.sqrt(sum / bufferLength);
    
    // 周波数解析（ピッチ検出）
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 1; i < frequencyArray.length / 4; i++) {
      if (frequencyArray[i] > maxValue) {
        maxValue = frequencyArray[i];
        maxIndex = i;
      }
    }
    
    const frequency = audioContextRef.current 
      ? maxIndex * (audioContextRef.current.sampleRate / 2) / bufferLength
      : 0;

    return { volume, frequency, maxValue };
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
  }, []);

  return {
    initializeAudio,
    analyzeAudio,
    cleanup,
    audioContext: audioContextRef.current,
    stream: streamRef.current
  };
};