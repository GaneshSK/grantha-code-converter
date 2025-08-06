
export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ImageFileState {
  id: string;
  file: File;
  previewUrl: string;
  status: ProcessingStatus;
  resultText: string | null;
  error: string | null;
}
