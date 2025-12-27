
import React, { useEffect, useRef } from 'react';

interface StepPanelProps {
  active?: boolean;
  type?: 'screen' | 'camera' | 'record';
  stream?: MediaStream | null;
  label: string;
  cameraOn?: boolean;
}

const StepPanel: React.FC<StepPanelProps> = ({ stream, label, type = 'screen', cameraOn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const renderIcon = () => {
    switch (type) {
      case 'camera':
        return (
          <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" className={cameraOn ? "text-[#036AFF]" : "text-[#ACACAC]"}>
            <path d="M224,72a8,8,0,0,0-8,0l-40,24V80a16,16,0,0,0-16-16H32A16,16,0,0,0,16,80V176a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16V160l40,24a8,8,0,0,0,8,0,8,8,0,0,0,4-6.92V78.92A8,8,0,0,0,224,72ZM160,176H32V80H160Zm48-18.36L176,138.38V117.62l32-19.26Z"></path>
          </svg>
        );
      case 'record':
        return (
          <svg width="32" height="32" viewBox="0 0 256 256" fill="#ACACAC">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a40,40,0,1,1-40-40A40,40,0,0,1,168,128Z"></path>
          </svg>
        );
      default: // screen
        return (
          <svg width="32" height="32" viewBox="0 0 256 256" fill="#ACACAC">
            <path d="M208,40H48A16,16,0,0,0,32,56V160a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,120H48V56H208V160ZM160,208a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48a8,8,0,0,1,0-16H136V128.4A80.09,80.09,0,0,1,208,128Z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="w-[312px] h-[196px] bg-[#F9F9F9] border border-[#EDEDED] rounded-[24px] overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all hover:border-[#036AFF]/40 group shadow-sm hover:shadow-md">
      {stream ? (
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-[#EDEDED] flex items-center justify-center group-hover:border-[#036AFF]/20 transition-colors">
            {renderIcon()}
          </div>
          <p className="text-[14px] text-[#9C9C9C] px-2 leading-relaxed font-normal">
            {label}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepPanel;
