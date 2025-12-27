
import React from 'react';
import { MediaDeviceState, RecordingStatus } from '../types';

interface FloatingToolbarProps {
  mediaState: MediaDeviceState;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  status: RecordingStatus;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ mediaState, onToggleCamera, onToggleMic, status }) => {
  const isRecording = status === RecordingStatus.RECORDING;

  const ButtonWrapper = ({ children, onClick, active, disabled }: { children: React.ReactNode, onClick?: () => void, active?: boolean, disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-[44px] h-[44px] flex items-center justify-center rounded-full transition-all
        ${active ? 'bg-[#036AFF] text-white shadow-lg shadow-blue-200' : 'bg-transparent text-[#ACACAC] hover:bg-gray-100'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[320px] h-[68px] bg-white border border-[#EDEDED] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] rounded-full flex items-center justify-center gap-[12px] px-4 z-50">
      {/* Play Circle Button (Preview Last) */}
      <ButtonWrapper disabled={!isRecording}>
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm36.44-92.66-48-32A8,8,0,0,0,104,98v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z"></path>
        </svg>
      </ButtonWrapper>

      {/* Export Button */}
      <ButtonWrapper>
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,11.32,11.32Z"></path>
        </svg>
      </ButtonWrapper>

      {/* Video Play (Camera) Toggle Button */}
      <ButtonWrapper onClick={onToggleCamera} active={mediaState.isCameraOn}>
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M224,72a8,8,0,0,0-8,0l-40,24V80a16,16,0,0,0-16-16H32A16,16,0,0,0,16,80V176a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16V160l40,24a8,8,0,0,0,8,0,8,8,0,0,0,4-6.92V78.92A8,8,0,0,0,224,72ZM160,176H32V80H160Zm48-18.36L176,138.38V117.62l32-19.26Z"></path>
        </svg>
      </ButtonWrapper>

      {/* Microphone Toggle Button */}
      <ButtonWrapper onClick={onToggleMic} active={mediaState.isMicOn}>
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0ZM208,128a8,8,0,0,1-16,0,64,64,0,0,0-128,0,8,8,0,0,1-16,0,80.09,80.09,0,0,1,72-79.6V208H104a8,8,0,0,1,0,16h48a8,8,0,0,1,0-16H136V128.4A80.09,80.09,0,0,1,208,128Z"></path>
        </svg>
      </ButtonWrapper>

      {/* Photo Camera Button */}
      <ButtonWrapper>
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M208,56H181.32l-15.55-23.33A16,16,0,0,0,152.46,24H103.54a16,16,0,0,0-13.31,8.67L74.68,56H48A16,16,0,0,0,32,72V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V72A16,16,0,0,0,208,56Zm0,136H48V72H80a8,8,0,0,0,6.66-3.56L102.21,40h51.58l15.55,28.44A8,8,0,0,0,176,72h32ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"></path>
        </svg>
      </ButtonWrapper>
    </div>
  );
};

export default FloatingToolbar;
