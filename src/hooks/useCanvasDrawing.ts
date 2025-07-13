import { useRef, useCallback } from 'react';
import { Position, DrawingConfig, FrequencyRange, DRAWING_CONSTANTS } from '../types/voice-paint';

export const useCanvasDrawing = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const lastPositionRef = useRef<Position | null>(null);
  const drawingTimeRef = useRef<number>(0);

  const getFrequencyRange = (frequency: number): FrequencyRange => {
    if (frequency > DRAWING_CONSTANTS.HIGH_FREQUENCY_THRESHOLD) return FrequencyRange.HIGH;
    if (frequency > DRAWING_CONSTANTS.MEDIUM_FREQUENCY_THRESHOLD) return FrequencyRange.MEDIUM;
    return FrequencyRange.LOW;
  };

  const calculateLineWidth = (frequency: number): number => {
    const width = 300 / Math.max(frequency, DRAWING_CONSTANTS.FREQUENCY_DIVISOR) * 10;
    return Math.max(DRAWING_CONSTANTS.MIN_LINE_WIDTH, Math.min(DRAWING_CONSTANTS.MAX_LINE_WIDTH, width));
  };

  const calculateOpacity = (volume: number): number => {
    return Math.min(1, volume * DRAWING_CONSTANTS.VOLUME_MULTIPLIER);
  };

  const calculateNextPosition = (
    frequency: number,
    volume: number,
    canvasWidth: number,
    canvasHeight: number
  ): Position => {
    if (!lastPositionRef.current) {
      return { x: canvasWidth / 2, y: canvasHeight / 2 };
    }

    drawingTimeRef.current += 0.02;
    
    const angleChange = (frequency / 1000) * Math.PI * 2;
    const distance = volume * DRAWING_CONSTANTS.MOVEMENT_MULTIPLIER;
    const angle = drawingTimeRef.current * angleChange;
    
    let x = lastPositionRef.current.x + Math.cos(angle) * distance;
    let y = lastPositionRef.current.y + Math.sin(angle) * distance;
    
    // 境界チェックと反射
    if (x < 0 || x > canvasWidth) {
      x = Math.max(0, Math.min(canvasWidth, x));
      drawingTimeRef.current += Math.PI;
    }
    if (y < 0 || y > canvasHeight) {
      y = Math.max(0, Math.min(canvasHeight, y));
      drawingTimeRef.current += Math.PI / 2;
    }

    return { x, y };
  };

  const drawHighFrequency = (
    ctx: CanvasRenderingContext2D,
    position: Position,
    config: DrawingConfig
  ) => {
    ctx.globalAlpha = config.opacity;
    ctx.fillStyle = config.brushColor;
    ctx.beginPath();
    ctx.arc(position.x, position.y, config.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawMediumFrequency = (
    ctx: CanvasRenderingContext2D,
    position: Position,
    config: DrawingConfig
  ) => {
    ctx.globalAlpha = config.opacity;
    ctx.strokeStyle = config.brushColor;
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPositionRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      ctx.quadraticCurveTo(
        (lastPositionRef.current.x + position.x) / 2,
        (lastPositionRef.current.y + position.y) / 2 - config.lineWidth,
        position.x,
        position.y
      );
      ctx.stroke();
    } else {
      drawHighFrequency(ctx, position, config);
    }
  };

  const drawLowFrequency = (
    ctx: CanvasRenderingContext2D,
    position: Position,
    config: DrawingConfig
  ) => {
    ctx.globalAlpha = config.opacity;
    ctx.strokeStyle = config.brushColor;
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPositionRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      ctx.lineTo(position.x, position.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = config.brushColor;
      ctx.beginPath();
      ctx.arc(position.x, position.y, config.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw = useCallback((
    frequency: number,
    volume: number,
    brushColor: string
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lineWidth = calculateLineWidth(frequency);
    const opacity = calculateOpacity(volume);
    const position = calculateNextPosition(frequency, volume, canvas.width, canvas.height);
    const config: DrawingConfig = { brushColor, lineWidth, opacity };

    const frequencyRange = getFrequencyRange(frequency);

    switch (frequencyRange) {
      case FrequencyRange.HIGH:
        drawHighFrequency(ctx, position, config);
        break;
      case FrequencyRange.MEDIUM:
        drawMediumFrequency(ctx, position, config);
        break;
      case FrequencyRange.LOW:
        drawLowFrequency(ctx, position, config);
        break;
    }

    lastPositionRef.current = position;
  }, [canvasRef]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastPositionRef.current = null;
    drawingTimeRef.current = 0;
  }, [canvasRef]);

  const resetPosition = useCallback(() => {
    lastPositionRef.current = null;
    drawingTimeRef.current = 0;
  }, []);

  return {
    draw,
    clearCanvas,
    resetPosition
  };
};