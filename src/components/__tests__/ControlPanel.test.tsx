import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlPanel } from '../ControlPanel';

describe('ControlPanel', () => {
  const mockProps = {
    isRecording: false,
    brushColor: '#ff6b6b',
    onRecordingToggle: jest.fn(),
    onBrushColorChange: jest.fn(),
    onClear: jest.fn(),
    onSave: jest.fn(),
    canSave: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all control buttons', () => {
    render(<ControlPanel {...mockProps} />);
    
    expect(screen.getByLabelText('録音を開始')).toBeInTheDocument();
    expect(screen.getByLabelText('ブラシの色')).toBeInTheDocument();
    expect(screen.getByLabelText('キャンバスをクリア')).toBeInTheDocument();
    expect(screen.getByLabelText('作品を保存')).toBeInTheDocument();
  });

  it('should show recording state when isRecording is true', () => {
    render(<ControlPanel {...mockProps} isRecording={true} />);
    
    expect(screen.getByLabelText('録音を停止')).toBeInTheDocument();
    expect(screen.getByText('🔴 録音中')).toBeInTheDocument();
  });

  it('should call onRecordingToggle when record button is clicked', () => {
    render(<ControlPanel {...mockProps} />);
    
    fireEvent.click(screen.getByLabelText('録音を開始'));
    expect(mockProps.onRecordingToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onBrushColorChange when color is changed', () => {
    render(<ControlPanel {...mockProps} />);
    
    const colorInput = screen.getByLabelText('ブラシの色');
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });
    
    expect(mockProps.onBrushColorChange).toHaveBeenCalledWith('#00ff00');
  });

  it('should disable save button when canSave is false', () => {
    render(<ControlPanel {...mockProps} canSave={false} />);
    
    const saveButton = screen.getByLabelText('作品を保存');
    expect(saveButton).toBeDisabled();
  });
});