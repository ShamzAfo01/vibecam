
import React, { useEffect, useState, useRef } from 'react';
import { SetupStep } from '../types';

interface StepPanelProps {
  step: SetupStep;
  currentStep: SetupStep;
  type?: 'screen' | 'camera' | 'record';
  stream?: MediaStream | null;
  label: string;
  cameraOn?: boolean;
}

const StepPanel: React.FC<StepPanelProps> = ({ step, currentStep, stream, label, type = 'screen', cameraOn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [screenAnimState, setScreenAnimState] = useState(0);
  const [cameraAnimPhase, setCameraAnimPhase] = useState(0); // 0: initial, 1: first big, 1.1: second small, 1.2: second big, 2: mic ui, 3: active
  const [recordAnimPhase, setRecordAnimPhase] = useState(0); // 0: blue button, 1: preview ui

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Screen 1 Loop
  useEffect(() => {
    if (type === 'screen' && currentStep === SetupStep.STEP_1 && !stream) {
      const cycle = async () => {
        await new Promise(r => setTimeout(r, 1500));
        setScreenAnimState(1);
        await new Promise(r => setTimeout(r, 2000));
        setScreenAnimState(0);
      };
      const interval = setInterval(cycle, 4500);
      cycle();
      return () => clearInterval(interval);
    }
    if (currentStep > SetupStep.STEP_1) {
      setScreenAnimState(0); // Static first frame
    }
  }, [type, currentStep, stream]);

  // Screen 2 Animation Sequence (Bouncy and Organic)
  useEffect(() => {
    if (type === 'camera' && currentStep === SetupStep.STEP_2 && !stream) {
      const sequence = async () => {
        setCameraAnimPhase(0); // Initial small
        await new Promise(r => setTimeout(r, 1200));
        
        setCameraAnimPhase(1); // Pulse 1: Big
        await new Promise(r => setTimeout(r, 600));
        
        setCameraAnimPhase(1.1); // Transition: Small
        await new Promise(r => setTimeout(r, 600));
        
        setCameraAnimPhase(1.2); // Pulse 2: Big
        await new Promise(r => setTimeout(r, 800));
        
        setCameraAnimPhase(2); // Mic UI transition starts
        await new Promise(r => setTimeout(r, 1800));
        
        setCameraAnimPhase(3); // Mic Active "Pop"
      };
      sequence();
    }
  }, [type, currentStep, stream]);

  // Screen 3 Animation Sequence (Very Slow)
  useEffect(() => {
    if (type === 'record' && currentStep === SetupStep.STEP_3) {
      const sequence = async () => {
        setRecordAnimPhase(0);
        await new Promise(r => setTimeout(r, 3000));
        setRecordAnimPhase(1);
      };
      sequence();
    }
  }, [type, currentStep]);

  const TrafficLights = ({ align }: { align: 'left' | 'right' }) => (
    <div className={`absolute top-3 flex gap-1.5 transition-all duration-1000 ease-in-out z-40 ${align === 'left' ? 'left-3' : 'right-3 flex-row-reverse'}`}>
      <div className="w-2 h-2 rounded-full bg-[#FE5F58]" />
      <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
      <div className="w-2 h-2 rounded-full bg-[#28C840]" />
    </div>
  );

  // Placeholder State (Future steps)
  if (currentStep < step) {
    return (
      <div className="w-[312px] h-[196px] bg-[#F9F9F9] border border-[#EDEDED] rounded-[24px]" />
    );
  }

  // SCREEN 1: Screen Selection
  if (type === 'screen' && !stream) {
    return (
      <div className={`relative w-[312px] h-[196px] border border-[#EDEDED] rounded-[24px] overflow-hidden transition-all duration-1000 ease-in-out flex flex-col items-center justify-center shadow-sm ${screenAnimState === 0 ? 'bg-[#F9F9F9]' : 'bg-[#F6F6F6]'}`}>
        <div className={`absolute w-[271px] h-[150px] top-[46px] bg-white border border-dashed border-[#D1D1D1] transition-all duration-1000 ease-in-out ${screenAnimState === 0 ? 'left-[41px] rounded-[24px_4px_4px_4px]' : 'left-[0px] rounded-[4px_24px_4px_4px]'}`}>
          <TrafficLights align={screenAnimState === 0 ? 'left' : 'right'} />
          <div className={`absolute top-[14px] w-[239px] h-[18px] transition-all duration-1000 ease-in-out flex flex-col gap-[4px] ${screenAnimState === 0 ? 'left-[52px] items-end' : 'left-[19px] items-start'}`}>
            <div className={`h-[7px] bg-[#F1F1F1] rounded-[4px] transition-all duration-1000 ${screenAnimState === 0 ? 'w-[79px]' : 'w-[77px]'}`} />
            <div className="w-[34px] h-[7px] bg-[#F1F1F1] rounded-[4px]" />
          </div>
        </div>
        <div className={`absolute w-[20px] h-[20px] bg-white rounded-full shadow-lg border border-black/5 transition-all duration-1000 ease-in-out flex items-center justify-center z-10 ${screenAnimState === 0 ? 'left-[11px] top-[162px]' : 'left-[281px] top-[161px]'}`}>
          <div className={`w-1 h-3 bg-[#404040] transition-transform duration-1000 ${screenAnimState === 0 ? 'rotate-[132deg]' : 'rotate-[-132deg]'}`} />
        </div>
      </div>
    );
  }

  // SCREEN 2: Camera & Mic
  if (type === 'camera' && !stream) {
    const isBig = cameraAnimPhase === 1 || cameraAnimPhase === 1.2;
    const isMicActive = cameraAnimPhase === 3;

    return (
      <div className="relative w-[312px] h-[196px] border border-[#EDEDED] rounded-[24px] overflow-hidden transition-all duration-1000 ease-in-out bg-[#F6F6F6] flex items-center justify-center">
        <TrafficLights align="left" />
        {cameraAnimPhase < 2 ? (
          <div className="absolute w-[110px] h-[70px] left-[184px] top-[108px] bg-white rounded-[8px] transition-all duration-1500 overflow-hidden shadow-sm">
             {/* Red dot transition - Custom cubic-bezier for springy feel */}
             <div 
               className={`absolute w-4 h-4 rounded-full bg-[#FFB8B8] flex items-center justify-center left-[3px] top-[3px] transition-transform duration-[600ms] ${isBig ? 'scale-[1.25]' : 'scale-100'}`}
               style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
             >
               <div className="w-3 h-3 rounded-full bg-[#F70101] flex items-center justify-center shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-[#F70101]" />
               </div>
             </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* White pill background - Bouncy entry */}
            <div 
              className={`absolute w-[164px] h-[33px] bg-white rounded-[24px] transition-all duration-[800ms] shadow-sm top-[146px] left-[74px] ${cameraAnimPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-4'}`} 
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            />
            
            {/* Mic Circle - Pop animation on activation */}
            <div 
              className={`absolute w-[50px] h-[50px] left-[131px] top-[138px] rounded-full flex items-center justify-center transition-all duration-[600ms] shadow-md z-10 ${isMicActive ? 'bg-[#036AFF] scale-100' : 'bg-[#D8E8FF] scale-[0.9]'}`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)' }}
            >
               <svg 
                 width="24" 
                 height="24" 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 className={`transition-transform duration-500 ${isMicActive ? 'scale-110' : 'scale-100'}`}
               >
                  <path 
                    d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15ZM5 10V11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11V10" 
                    stroke={isMicActive ? 'white' : '#036AFF'} 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
               </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 3: Record Initiation
  if (type === 'record') {
    return (
      <div className="relative w-[312px] h-[196px] border border-[#EDEDED] rounded-[24px] overflow-hidden transition-all duration-1000 ease-in-out bg-[#F6F6F6] flex items-center justify-center">
        <TrafficLights align="left" />
        {recordAnimPhase === 0 ? (
          <div className="absolute w-[196px] h-[55px] left-[58px] top-[70px] bg-[#036AFF] border border-[#0148AF] shadow-[inset_0px_2px_4px_#7AACF5] rounded-[99px] flex items-center justify-center gap-[16px]">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
               <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" />
             </svg>
             <div className="w-[124px] h-[9px] bg-[#A2C8FF] rounded-[4px]" />
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Transparent dark frame Frame 1000011112 */}
            <div className="absolute w-full h-[55px] bg-[#222222]/36 top-0 left-0 z-10" />
            
            {/* White playback preview mockup reaching the bottom edge Frame 1000011101 */}
            <div className="absolute inset-x-0 bottom-0 top-[42px] bg-white border border-dashed border-[#D1D1D1] rounded-t-[8px] z-20" />
            
            {/* Top right icon Controls */}
            <div className="absolute top-[8px] right-[10px] z-30">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                 <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M10 8L15.5 12L10 16V8Z" fill="#E0E0E0"/>
               </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-[312px] h-[196px] bg-[#F9F9F9] border border-[#EDEDED] rounded-[24px] flex items-center justify-center p-6 text-center shadow-sm">
      <p className="text-[14px] text-[#9C9C9C] font-normal">{label}</p>
    </div>
  );
};

export default StepPanel;
