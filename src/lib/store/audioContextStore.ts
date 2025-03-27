import { create } from 'zustand';

type AudioContextStore = {
  contextStarted: boolean;
  setContextStarted: (value: boolean) => void;
}

export const useAudioContextStore = create<AudioContextStore>((set) => ({
  contextStarted: false,
  setContextStarted: (value) => set({ contextStarted: value }),
}));