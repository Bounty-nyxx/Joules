export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export interface SoundPad {
  id: string;
  name: string;
  category: "Beats" | "Bass" | "Melody" | "Synth" | "Vocal FX";
  color: string;
  waveType: "sine" | "triangle" | "sawtooth" | "square";
  baseFreq: number; // base frequency in Hz
  rhythmPattern: number[]; // 16-step trigger grid
  isActive: boolean;
}

export interface SavedProject {
  id: string;
  name: string;
  bpm: number;
  lyrics: string;
  selectedPadIds: string[];
  createdAt: string;
}

export interface SavedRecording {
  id: string;
  name: string;
  durationMs: number;
  createdAt: string;
  audioUrl?: string; // Blob URL representing recorded master Audio
}
