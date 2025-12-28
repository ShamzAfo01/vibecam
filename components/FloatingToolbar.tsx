
import React from 'react';
import { MediaDeviceState, RecordingStatus, SetupStep } from '../types';

interface FloatingToolbarProps {
  mediaState: MediaDeviceState;
  currentStep: SetupStep;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  status: RecordingStatus;
  onHoverName: (name: string | null) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ mediaState, currentStep, onToggleCamera, onToggleMic, status, onHoverName }) => {
  const isRecording = status === RecordingStatus.RECORDING;
  const strokeWidth = 1.5;

  const ButtonWrapper = ({ children, name, onClick, active, disabled, visible }: { children: React.ReactNode, name: string, onClick?: () => void, active?: boolean, disabled?: boolean, visible: boolean }) => (
    <button
      onClick={onClick}
      onMouseEnter={() => visible && onHoverName(name)}
      onMouseLeave={() => onHoverName(null)}
      disabled={disabled || !visible}
      className={`
        w-[44px] h-[44px] flex items-center justify-center rounded-full transition-all duration-1000
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}
        ${active ? 'bg-[#036AFF] text-white shadow-lg shadow-blue-200' : 'bg-transparent text-[#ACACAC] hover:bg-gray-100'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className={`fixed bottom-[108px] left-1/2 -translate-x-1/2 w-[320px] h-[68px] bg-white border border-[#EDEDED] shadow-[0px_4px_12px_2px_rgba(207,207,207,0.25)] rounded-[99px] flex items-center justify-center gap-[18px] px-[10px] z-50 transition-all duration-1500 ease-in-out ${currentStep >= SetupStep.STEP_1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      
      {/* 1. Play Circle / Preview (Eases in at Step 1 or Step 3 per user request clarification) */}
      <ButtonWrapper 
        name="Preview"
        visible={currentStep >= SetupStep.STEP_1} 
        disabled={!isRecording}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#4B4B4B" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 8L15.5 12L10 16V8Z" fill="#4B4B4B"/>
        </svg>
      </ButtonWrapper>

      {/* 2. Export (First button appearing in Step 1) */}
      <ButtonWrapper 
        name="Export"
        visible={currentStep >= SetupStep.STEP_1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 14.5V3.5M12 3.5L8.5 7M12 3.5L15.5 7" stroke="#ACACAC" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.5 13.5V14.5C3.5 18.0899 6.41015 21 10 21H14C17.5899 21 20.5 18.0899 20.5 14.5V13.5" stroke="#ACACAC" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ButtonWrapper>

      {/* 3. Camera & 4. Mic (Eases in at Step 2) */}
      <ButtonWrapper 
        name="Camera"
        onClick={onToggleCamera} 
        active={mediaState.isCameraOn}
        visible={currentStep >= SetupStep.STEP_2}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 15.1118L18.6667 17.0253C19.6467 17.5367 21 16.84 21 15.7003V8.29969C21 7.16 19.6467 6.46332 18.6667 6.97467L15 8.8882V15.1118ZM13 18H5C3 18 2 17 2 15V9C2 7 3 6 5 6H13C15 6 16 7 16 9V15C16 17 15 18 13 18Z" stroke={mediaState.isCameraOn ? 'white' : '#ACACAC'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ButtonWrapper>

      <ButtonWrapper 
        name="Microphone"
        onClick={onToggleMic} 
        active={mediaState.isMicOn}
        visible={currentStep >= SetupStep.STEP_2}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15ZM5 10V11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11V10M12 18V21M9 21H15" stroke={mediaState.isMicOn ? 'white' : '#ACACAC'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ButtonWrapper>

      {/* 5. TV Icon / Screen (Eases in at Step 3) */}
      <ButtonWrapper 
        name="Screen Source"
        visible={currentStep >= SetupStep.STEP_3}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7C5 5 4 6 4 8V16C4 18 5 19 7 19H17C19 19 20 18 20 16V8C20 6 19 5 17 5H15L14 3H10L9 5ZM12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15Z" stroke="#ACACAC" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ButtonWrapper>
    </div>
  );
};

export default FloatingToolbar;
