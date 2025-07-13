import { getAudioErrorType, createAudioError, AudioErrorType } from '../errorHandlers';

describe('errorHandlers', () => {
  describe('getAudioErrorType', () => {
    it('should identify NotAllowedError correctly', () => {
      const error = new Error();
      error.name = 'NotAllowedError';
      expect(getAudioErrorType(error)).toBe(AudioErrorType.NOT_ALLOWED);
    });

    it('should identify NotFoundError correctly', () => {
      const error = new Error();
      error.name = 'NotFoundError';
      expect(getAudioErrorType(error)).toBe(AudioErrorType.NOT_FOUND);
    });

    it('should identify NotSupportedError correctly', () => {
      const error = new Error();
      error.name = 'NotSupportedError';
      expect(getAudioErrorType(error)).toBe(AudioErrorType.NOT_SUPPORTED);
    });

    it('should return UNKNOWN for unrecognized errors', () => {
      const error = new Error();
      error.name = 'SomeOtherError';
      expect(getAudioErrorType(error)).toBe(AudioErrorType.UNKNOWN);
    });
  });

  describe('createAudioError', () => {
    it('should create proper error object for NotAllowedError', () => {
      const error = new Error('Permission denied');
      error.name = 'NotAllowedError';
      
      const audioError = createAudioError(error);
      
      expect(audioError.type).toBe(AudioErrorType.NOT_ALLOWED);
      expect(audioError.message).toBe('Permission denied');
      expect(audioError.userFriendlyMessage).toBe('マイクの許可が拒否されました');
      expect(audioError.suggestions).toHaveLength(3);
    });

    it('should create proper error object for unknown errors', () => {
      const error = new Error('Something went wrong');
      error.name = 'UnknownError';
      
      const audioError = createAudioError(error);
      
      expect(audioError.type).toBe(AudioErrorType.UNKNOWN);
      expect(audioError.message).toBe('Something went wrong');
      expect(audioError.userFriendlyMessage).toBe('予期しないエラーが発生しました');
      expect(audioError.suggestions.some(s => s.includes('Something went wrong'))).toBe(true);
    });
  });
});