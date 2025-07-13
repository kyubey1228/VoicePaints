import React, { memo } from 'react';

interface AudioVisualizerProps {
  frequency: number;
  volume: number;
  isVisible: boolean;
}

export const AudioVisualizer = memo<AudioVisualizerProps>(({
  frequency,
  volume,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">周波数 (Hz)</h3>
        <div className="text-2xl text-green-400 font-mono">
          {frequency.toFixed(1)}
        </div>
        <div className="text-sm text-gray-300">線の太さに影響</div>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-400 transition-all duration-100"
            style={{ width: `${Math.min(100, frequency / 10)}%` }}
          />
        </div>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">音量</h3>
        <div className="text-2xl text-orange-400 font-mono">
          {(volume * 100).toFixed(1)}%
        </div>
        <div className="text-sm text-gray-300">色の濃さに影響</div>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-400 transition-all duration-100"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});