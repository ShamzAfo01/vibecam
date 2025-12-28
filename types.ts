
export enum RecordingStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum SetupStep {
  STEP_1 = 1,
  STEP_2 = 2,
  STEP_3 = 3
}

export interface MediaDeviceState {
  hasCamera: boolean;
  hasMic: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
}
