import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, Twitter } from 'lucide-react';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import { useMediaRecorder } from '../hooks/useMediaRecorder';
import { ControlPanel } from './ControlPanel';
import { AudioVisualizer } from './AudioVisualizer';
import { Instructions } from './Instructions';
import { ErrorDialog } from './ErrorDialog';
import { createAudioError, AudioError } from '../utils/errorHandlers';
import { DRAWING_CONSTANTS, CanvasSize } from '../types/voice-paint';

const VoicePaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentFrequency, setCurrentFrequency] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState<number>(0);
  const [brushColor, setBrushColor] = useState<string>('#ff6b6b');
  const [canvasSize] = useState<CanvasSize>({ width: 800, height: 600 });
  const [audioError, setAudioError] = useState<AudioError | null>(null);

  // カスタムフックの使用
  const { initializeAudio, analyzeAudio: analyzeAudioData, cleanup: cleanupAudio } = useAudioAnalyzer();
  const { draw, clearCanvas, resetPosition } = useCanvasDrawing(canvasRef);
  const { 
    startRecording: startMediaRecording, 
    stopRecording: stopMediaRecording, 
    downloadRecording,
    recordedChunks 
  } = useMediaRecorder();

  // 音声解析とペイント処理
  const analyzeAndDraw = useCallback(() => {
    const result = analyzeAudioData();
    if (!result) {
      animationFrameRef.current = requestAnimationFrame(analyzeAndDraw);
      return;
    }

    const { volume, frequency, maxValue } = result;
    setCurrentFrequency(frequency);
    setCurrentVolume(volume);

    // 音声がある程度の大きさの時だけ描画
    if (volume > DRAWING_CONSTANTS.MIN_VOLUME_THRESHOLD && 
        maxValue > DRAWING_CONSTANTS.MIN_FREQUENCY_VALUE && 
        isDrawingRef.current) {
      draw(frequency, volume, brushColor);
    }

    animationFrameRef.current = requestAnimationFrame(analyzeAndDraw);
  }, [analyzeAudioData, draw, brushColor]);

  // マイクの開始
  const startRecording = async (): Promise<void> => {
    try {
      setAudioError(null);
      const stream = await initializeAudio();
      
      // 録音開始
      startMediaRecording(stream);
      
      setIsRecording(true);
      isDrawingRef.current = true;
      
      // 音声解析開始
      analyzeAndDraw();
      
    } catch (error) {
      console.error('マイクアクセスエラー:', error);
      const audioError = createAudioError(error as Error);
      setAudioError(audioError);
    }
  };

  // 録音停止
  const stopRecording = (): void => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    stopMediaRecording();
    cleanupAudio();
    
    setIsRecording(false);
    isDrawingRef.current = false;
    setCurrentFrequency(0);
    setCurrentVolume(0);
    
    resetPosition();
  };

  // 録音の開始/停止トグル
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording]);

  // 作品保存（画像 + 音声）
  const saveArtwork = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const timestamp = Date.now();
    const imageDataURL = canvas.toDataURL('image/png');
    
    // 画像をダウンロード
    const imageLink = document.createElement('a');
    imageLink.download = `voice-art-${timestamp}.png`;
    imageLink.href = imageDataURL;
    imageLink.click();
    
    // 音声をダウンロード（録音されている場合）
    if (recordedChunks.length > 0) {
      downloadRecording(`voice-art-audio-${timestamp}`);
    }
  }, [recordedChunks, downloadRecording]);

  // キャンバスのサイズを設定
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
    }
  }, [canvasSize]);

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Volume2 className="w-8 h-8" />
                Voice Paint
              </h1>
              <p className="text-blue-200">歌いながら絵を描こう！声の高低で線の太さ、音量で色の濃さが変わります</p>
            </div>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Voice Paintで声を使ってアートを作ってみました！🎨🎤\n\n')}&url=${encodeURIComponent(window.location.href)}&hashtags=${encodeURIComponent('VoicePaint,WebAudioAPI,CreativeCoding')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              aria-label="Twitterでシェア"
            >
              <Twitter className="w-5 h-5" />
              <span className="hidden sm:inline">シェア</span>
            </a>
          </div>
        </header>

        {/* コントロールパネル */}
        <ControlPanel
          isRecording={isRecording}
          brushColor={brushColor}
          onRecordingToggle={toggleRecording}
          onBrushColorChange={setBrushColor}
          onClear={clearCanvas}
          onSave={saveArtwork}
          canSave={!isRecording || recordedChunks.length > 0}
        />

        {/* 音声ビジュアライザー */}
        <AudioVisualizer
          frequency={currentFrequency}
          volume={currentVolume}
          isVisible={isRecording}
        />

        {/* キャンバス */}
        <main className="bg-white rounded-xl p-4 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full border-2 border-gray-200 rounded-lg"
            style={{ background: '#fafafa' }}
            role="img"
            aria-label="音声で描画されるキャンバス"
          />
        </main>

        {/* 使い方 */}
        <Instructions />

        {/* エラーダイアログ */}
        <ErrorDialog 
          error={audioError} 
          onClose={() => setAudioError(null)} 
        />
      </div>
    </div>
  );
};

export default VoicePaintApp;
