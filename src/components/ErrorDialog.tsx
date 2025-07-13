import React, { memo } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AudioError } from '../utils/errorHandlers';

interface ErrorDialogProps {
  error: AudioError | null;
  onClose: () => void;
}

export const ErrorDialog = memo<ErrorDialogProps>(({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">エラーが発生しました</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 font-medium">{error.userFriendlyMessage}</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">解決方法:</h3>
          <ul className="space-y-1">
            {error.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
});