
import React, { useEffect, useRef } from 'react';

interface RecordingOverlayProps {
  time: number;
  cameraStream: MediaStream | null;
  onStop: () => void;
}

const RecordingOverlay: React.FC<RecordingOverlayProps> = ({ time, cameraStream, onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-between p-10 border-4 border-red-500/20 bg-black/5">
      {/* Top Status Bar */}
      <div className="w-full flex justify-between items-start">
        <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-4 border border-white/10 pointer-events-auto shadow-2xl">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
          <span className="text-white font-semibold font-mono text-xl tracking-wider">
            {formatTime(time)}
          </span>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Recording</span>
        </div>

        <button 
          onClick={onStop}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg pointer-events-auto active:scale-95 flex items-center gap-3 group"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="9" width="6" height="6" rx="1.2" fill="currentColor" />
          </svg>
          Stop & Save
        </button>
      </div>

      {/* Picture-in-Picture Camera Preview */}
      {cameraStream && (
        <div className="absolute bottom-32 right-10 w-[240px] aspect-video bg-black rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden pointer-events-auto group ring-1 ring-black/10">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white/90 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
             Live Preview
          </div>
        </div>
      )}

      {/* Recording indicator at corners */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-red-500/30 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-red-500/30 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-red-500/30 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-red-500/30 rounded-br-3xl" />
    </div>
  );
};

export default RecordingOverlay;
