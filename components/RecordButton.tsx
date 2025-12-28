
import React from 'react';
import { RecordingStatus } from '../types';

interface RecordButtonProps {
  status: RecordingStatus;
  onStart: () => void;
  onStop: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ status, onStart, onStop }) => {
  const isRecording = status === RecordingStatus.RECORDING;
  const strokeWidth = 1.8;

  return (
    <button 
      onClick={isRecording ? onStop : onStart}
      className={`
        relative w-[252px] h-[55px] flex items-center justify-center gap-[16px] 
        rounded-full border-[0.5px] shadow-[inset_0px_2px_4px_#7AACF5]
        transition-all active:scale-95 group overflow-hidden
        ${isRecording 
          ? 'bg-red-500 border-red-700 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3)]' 
          : 'bg-[#036AFF] border-[#0148AF]'
        }
      `}
    >
      <div className="relative w-7 h-7 flex items-center justify-center">
        {isRecording ? (
           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
             <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" />
           </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="4.5" fill="white" />
          </svg>
        )}
      </div>
      <span className="text-[20px] font-medium text-white tracking-[0.005em]">
        {isRecording ? 'Stop Recording' : 'Record your screen'}
      </span>
    </button>
  );
};

export default RecordButton;
