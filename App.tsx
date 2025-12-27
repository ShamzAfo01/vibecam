
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StepPanel from './components/StepPanel';
import RecordButton from './components/RecordButton';
import FloatingToolbar from './components/FloatingToolbar';
import RecordingOverlay from './components/RecordingOverlay';
import { RecordingStatus, MediaDeviceState } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<RecordingStatus>(RecordingStatus.IDLE);
  const [mediaState, setMediaState] = useState<MediaDeviceState>({
    hasCamera: false,
    hasMic: false,
    isCameraOn: false,
    isMicOn: true,
  });
  
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize media devices check
  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setMediaState(prev => ({
          ...prev,
          hasCamera: devices.some(d => d.kind === 'videoinput'),
          hasMic: devices.some(d => d.kind === 'audioinput'),
        }));
      } catch (err) {
        console.error("Error checking devices", err);
      }
    };
    checkDevices();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // 1. Get Screen Stream
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as any,
        audio: mediaState.isMicOn,
      });
      setScreenStream(screen);

      // 2. Get Camera Stream if active
      if (mediaState.isCameraOn) {
        try {
          const camera = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          setCameraStream(camera);
        } catch (camErr) {
          console.warn("Camera access denied or unavailable", camErr);
        }
      }

      const recorder = new MediaRecorder(screen, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibecam-recording-${Date.now()}.webm`;
        a.click();
        
        // Reset streams
        if (screenStream) screenStream.getTracks().forEach(t => t.stop());
        if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
        setScreenStream(null);
        setCameraStream(null);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recorder.start();
      setStatus(RecordingStatus.RECORDING);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Failed to start recording", err);
      setStatus(RecordingStatus.IDLE);
    }
  }, [mediaState.isMicOn, mediaState.isCameraOn, screenStream, cameraStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStatus(RecordingStatus.IDLE);
  }, []);

  const toggleCamera = useCallback(() => {
    setMediaState(prev => ({ ...prev, isCameraOn: !prev.isCameraOn }));
  }, []);

  const toggleMic = useCallback(() => {
    setMediaState(prev => ({ ...prev, isMicOn: !prev.isMicOn }));
  }, []);

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden select-none flex flex-col items-center justify-center">
      <Header />

      {/* Main Setup Content */}
      <main className={`flex flex-col items-center space-y-16 transition-all duration-700 ${status === RecordingStatus.RECORDING ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        
        {/* Step Indicators Group */}
        <div className="flex flex-row space-x-12 items-start">
          {/* Step 1 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[22px] font-medium leading-[26px] tracking-[0.005em] text-[#656565]">
              Choose a screen
            </h3>
            <StepPanel 
              type="screen"
              stream={screenStream}
              label="Select your display or window to share with your audience."
            />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[15px] font-normal leading-[18px] tracking-[0.005em] text-[#9C9C9C] h-[26px] flex items-center">
              Choose a camera, microphone.
            </h3>
            <StepPanel 
              type="camera"
              cameraOn={mediaState.isCameraOn}
              stream={cameraStream}
              label="Configure your visuals and audio settings."
            />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[15px] font-normal leading-[18px] tracking-[0.005em] text-[#9C9C9C] h-[26px] flex items-center">
              3. Click on record
            </h3>
            <StepPanel 
              type="record"
              label="Ready to go? Hit the record button below to start your session."
            />
          </div>
        </div>

        {/* Central Action Button */}
        <div className="pt-4">
          <RecordButton 
            status={status} 
            onStart={startRecording} 
            onStop={stopRecording} 
          />
        </div>
      </main>

      {/* Floating Bottom Toolbar */}
      <FloatingToolbar 
        mediaState={mediaState}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        status={status}
      />

      {/* Fullscreen Recording Overlay */}
      {status === RecordingStatus.RECORDING && (
        <RecordingOverlay 
          time={recordingTime} 
          cameraStream={cameraStream}
          onStop={stopRecording}
        />
      )}
    </div>
  );
};

export default App;
