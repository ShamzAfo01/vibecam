
export enum RecordingStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface MediaDeviceState {
  hasCamera: boolean;
  hasMic: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
}
