import React, { memo } from 'react';
import { Mic, MicOff, Download, Trash2, Palette } from 'lucide-react';

interface ControlPanelProps {
  isRecording: boolean;
  brushColor: string;
  onRecordingToggle: () => void;
  onBrushColorChange: (color: string) => void;
  onClear: () => void;
  onSave: () => void;
  canSave: boolean;
}

export const ControlPanel = memo<ControlPanelProps>(({
  isRecording,
  brushColor,
  onRecordingToggle,
  onBrushColorChange,
  onClear,
  onSave,
  canSave
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onRecordingToggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50'
            }`}
            aria-label={isRecording ? '録音を停止' : '録音を開始'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isRecording ? '録音停止' : '録音開始'}
          </button>

          <div 
            className={`px-3 py-2 rounded-lg bg-white/5 text-white text-sm ${
              isRecording ? 'animate-pulse' : ''
            }`}
            role="status"
            aria-live="polite"
          >
            {isRecording ? '🔴 録音中' : '⚪ 待機中'}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="brush-color" className="sr-only">ブラシの色を選択</label>
            <Palette className="w-5 h-5 text-white" />
            <input
              id="brush-color"
              type="color"
              value={brushColor}
              onChange={(e) => onBrushColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer transition-transform hover:scale-110"
              aria-label="ブラシの色"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50"
            aria-label="キャンバスをクリア"
          >
            <Trash2 className="w-4 h-4" />
            クリア
          </button>
          <button
            onClick={onSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
              canSave
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/50'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
            }`}
            disabled={!canSave}
            aria-label="作品を保存"
          >
            <Download className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
});