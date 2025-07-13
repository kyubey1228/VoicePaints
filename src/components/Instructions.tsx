import React, { memo } from 'react';

export const Instructions = memo(() => {
  return (
    <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">使い方</h3>
      <div className="grid md:grid-cols-3 gap-4 text-white mb-6">
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
          <h4 className="font-semibold text-green-400 mb-2">🎵 高い声</h4>
          <p className="text-sm">細い線、点描になります</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
          <h4 className="font-semibold text-blue-400 mb-2">🎶 中音域</h4>
          <p className="text-sm">波状の線で描画されます</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
          <h4 className="font-semibold text-red-400 mb-2">🎵 低い声</h4>
          <p className="text-sm">太い線で描画されます</p>
        </div>
      </div>

      <details className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <summary className="font-semibold text-yellow-400 cursor-pointer hover:text-yellow-300">
          📝 マイクが使えない場合
        </summary>
        <ul className="text-sm text-yellow-100 space-y-1 mt-2">
          <li>• ブラウザのアドレスバー左側のマイクアイコンを確認</li>
          <li>• マイクへのアクセスを「許可」に設定</li>
          <li>• Chrome、Firefox、Edge等のモダンブラウザを使用</li>
          <li>• HTTPSが必要：localhost または https:// のサイトで動作</li>
          <li>• F12でコンソールを開いてエラーメッセージを確認</li>
        </ul>
      </details>
    </div>
  );
});