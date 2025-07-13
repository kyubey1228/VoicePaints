import { useRef, useCallback } from 'react';

interface UseMediaRecorderOptions {
  onDataAvailable?: (data: Blob) => void;
  onStart?: () => void;
  onStop?: () => void;
  onError?: (error: Event) => void;
}

export const useMediaRecorder = (options: UseMediaRecorderOptions = {}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/mpeg'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return '';
  };

  const startRecording = useCallback((stream: MediaStream) => {
    try {
      const mimeType = getSupportedMimeType();
      const mediaRecorderOptions: MediaRecorderOptions | undefined = mimeType 
        ? { mimeType } 
        : undefined;

      mediaRecorderRef.current = mediaRecorderOptions 
        ? new MediaRecorder(stream, mediaRecorderOptions)
        : new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          options.onDataAvailable?.(event.data);
        }
      };

      mediaRecorderRef.current.onstart = () => {
        options.onStart?.();
      };

      mediaRecorderRef.current.onstop = () => {
        options.onStop?.();
      };

      mediaRecorderRef.current.onerror = (error: Event) => {
        console.error('MediaRecorder error:', error);
        options.onError?.(error);
      };

      mediaRecorderRef.current.start(100); // 100ms毎にデータを取得
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const getRecordedBlob = useCallback((): Blob | null => {
    if (recordedChunksRef.current.length === 0) return null;

    const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
    return new Blob(recordedChunksRef.current, { type: mimeType });
  }, []);

  const downloadRecording = useCallback((filename?: string) => {
    const blob = getRecordedBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const extension = blob.type.includes('webm') ? 'webm' : 'ogg';
    link.download = filename || `recording-${Date.now()}.${extension}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [getRecordedBlob]);

  return {
    startRecording,
    stopRecording,
    getRecordedBlob,
    downloadRecording,
    recordedChunks: recordedChunksRef.current,
    isRecording: mediaRecorderRef.current?.state === 'recording'
  };
};