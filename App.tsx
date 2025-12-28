
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StepPanel from './components/StepPanel';
import RecordButton from './components/RecordButton';
import FloatingToolbar from './components/FloatingToolbar';
import RecordingOverlay from './components/RecordingOverlay';
import { RecordingStatus, MediaDeviceState, SetupStep } from './types';

const App: React.FC = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.STEP_1);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>(RecordingStatus.IDLE);
  const [hoveredToolbarName, setHoveredToolbarName] = useState<string | null>(null);
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

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Guided Setup Sequence with slow, smooth transitions
  useEffect(() => {
    if (!isAppReady) return;

    const sequence = async () => {
      // Step 1: Animation runs
      await new Promise(r => setTimeout(r, 6000));
      setCurrentStep(SetupStep.STEP_2);

      // Step 2: Animation runs
      await new Promise(r => setTimeout(r, 8000));
      setCurrentStep(SetupStep.STEP_3);

      // Step 3 animation in StepPanel takes ~3000ms. 
      // We wait for it to finish before showing the record button.
      await new Promise(r => setTimeout(r, 4500));
      setIsSetupComplete(true);
    };

    sequence();
  }, [isAppReady]);

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
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as any,
        audio: mediaState.isMicOn,
      });
      setScreenStream(screen);

      if (mediaState.isCameraOn) {
        try {
          const camera = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          setCameraStream(camera);
        } catch (camErr) {
          console.warn("Camera access denied", camErr);
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
        a.download = `vibecam-${Date.now()}.webm`;
        a.click();

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
      console.error("Recording failed", err);
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

  const activeTitleStyle = "text-[18px] font-medium leading-[26px] tracking-[0.005em] text-[#8a8a8a] transition-all duration-1000";
  const inactiveTitleStyle = "text-[15px] font-normal leading-[18px] tracking-[0.005em] text-[#9C9C9C] h-[26px] flex items-center transition-all duration-1000";

  return (
    <div className={`relative w-full h-full min-h-screen bg-white overflow-hidden transition-all duration-1500 ease-in-out ${isAppReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Header />

      {/* Hover Information Display */}
      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-[60]">
        <span className={`text-[15px] font-normal leading-[18px] tracking-[0.005em] text-[#9C9C9C] transition-all duration-300 ${hoveredToolbarName ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {hoveredToolbarName}
        </span>
      </div>

      <main className={`flex flex-col items-center justify-center h-full transition-all duration-1000 ${status === RecordingStatus.RECORDING ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>

        <div className="flex flex-row space-x-12 items-start justify-center">
          {/* Step 1 */}
          <div className="flex flex-col space-y-4">
            <h3 className={currentStep === SetupStep.STEP_1 ? activeTitleStyle : inactiveTitleStyle}>
              1. Choose a screen
            </h3>
            <StepPanel
              type="screen"
              step={SetupStep.STEP_1}
              currentStep={currentStep}
              stream={screenStream}
              label="Select your display or window"
            />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col space-y-4">
            <h3 className={currentStep === SetupStep.STEP_2 ? activeTitleStyle : inactiveTitleStyle}>
              2. Choose a camera, microphone.
            </h3>
            <StepPanel
              type="camera"
              step={SetupStep.STEP_2}
              currentStep={currentStep}
              cameraOn={mediaState.isCameraOn}
              stream={cameraStream}
              label="Configure visuals and audio."
            />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col space-y-4">
            <h3 className={currentStep === SetupStep.STEP_3 ? activeTitleStyle : inactiveTitleStyle}>
              3. Click on record
            </h3>
            <StepPanel
              type="record"
              step={SetupStep.STEP_3}
              currentStep={currentStep}
              label="Ready to hit the button."
            />
          </div>
        </div>

        {/* Record Button Eases in ONLY after Step 3 animation is complete */}
        <div className={`mt-20 transition-all duration-1000 ease-in-out ${isSetupComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <RecordButton
            status={status}
            onStart={startRecording}
            onStop={stopRecording}
          />
        </div>
      </main>

      <FloatingToolbar
        mediaState={mediaState}
        currentStep={currentStep}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        status={status}
        onHoverName={setHoveredToolbarName}
      />

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
