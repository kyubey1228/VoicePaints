export enum AudioErrorType {
  NOT_ALLOWED = 'NotAllowedError',
  NOT_FOUND = 'NotFoundError',
  NOT_SUPPORTED = 'NotSupportedError',
  ABORT = 'AbortError',
  UNKNOWN = 'Unknown'
}

export interface AudioError {
  type: AudioErrorType;
  message: string;
  userFriendlyMessage: string;
  suggestions: string[];
}

export const getAudioErrorType = (error: Error): AudioErrorType => {
  if (error.name === 'NotAllowedError') return AudioErrorType.NOT_ALLOWED;
  if (error.name === 'NotFoundError') return AudioErrorType.NOT_FOUND;
  if (error.name === 'NotSupportedError') return AudioErrorType.NOT_SUPPORTED;
  if (error.name === 'AbortError') return AudioErrorType.ABORT;
  return AudioErrorType.UNKNOWN;
};

export const createAudioError = (error: Error): AudioError => {
  const type = getAudioErrorType(error);
  
  const errorMessages: Record<AudioErrorType, { message: string; suggestions: string[] }> = {
    [AudioErrorType.NOT_ALLOWED]: {
      message: 'マイクの許可が拒否されました',
      suggestions: [
        'ブラウザのアドレスバー左側のマイクアイコンをクリックして許可してください',
        'ブラウザの設定でマイクのアクセスを許可してください',
        'プライベートブラウジングモードの場合は通常モードでお試しください'
      ]
    },
    [AudioErrorType.NOT_FOUND]: {
      message: 'マイクが見つかりません',
      suggestions: [
        'マイクが正しく接続されているか確認してください',
        'デバイスのオーディオ設定を確認してください',
        '外部マイクを使用している場合は、接続を確認してください'
      ]
    },
    [AudioErrorType.NOT_SUPPORTED]: {
      message: 'このブラウザはマイクアクセスに対応していません',
      suggestions: [
        'Chrome、Firefox、Edgeなどの最新ブラウザをお使いください',
        'ブラウザを最新バージョンにアップデートしてください',
        'HTTPSで接続されているか確認してください'
      ]
    },
    [AudioErrorType.ABORT]: {
      message: 'マイクアクセスが中断されました',
      suggestions: [
        'もう一度お試しください',
        '他のアプリケーションがマイクを使用していないか確認してください'
      ]
    },
    [AudioErrorType.UNKNOWN]: {
      message: '予期しないエラーが発生しました',
      suggestions: [
        'ページを更新してもう一度お試しください',
        'ブラウザのコンソールでエラーの詳細を確認してください',
        `エラーメッセージ: ${error.message}`
      ]
    }
  };

  const errorInfo = errorMessages[type];
  
  return {
    type,
    message: error.message,
    userFriendlyMessage: errorInfo.message,
    suggestions: errorInfo.suggestions
  };
};