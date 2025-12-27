
import React from 'react';
import { RecordingStatus } from '../types';

interface RecordButtonProps {
  status: RecordingStatus;
  onStart: () => void;
  onStop: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ status, onStart, onStop }) => {
  const isRecording = status === RecordingStatus.RECORDING;

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
           <svg width="24" height="24" viewBox="0 0 256 256" fill="white">
             <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm32-88a8,8,0,0,1-8,8H104a8,8,0,0,1-8-8V104a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"></path>
           </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 256 256" fill="white">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a40,40,0,1,1-40-40A40,40,0,0,1,168,128Z"></path>
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
