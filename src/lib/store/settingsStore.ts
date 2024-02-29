import { initPreset } from "../presets/Init";
import { create } from "zustand";
import { Preset } from "../types/types";

export const useSynthSettingsStore = create((set) => ({
  presetName: initPreset.presetName,
  osc1: initPreset.osc1,
  osc2: initPreset.osc2,
  noise: initPreset.noise,
    envelopeAmplitude: initPreset.envelopeAmplitude,
  isSelectingLFO: false,
  setAllParamsFromPreset: (preset: Preset) => {
    set({
      presetName: preset.presetName,
      osc1: preset.osc1,
      osc2: preset.osc2,
      noise: preset.noise,
    });
  },
  setNoiseParams: (param) => {
    set((state) => ({ noise: { ...state.noise, ...param } }));
  },
  setEnvAmplitudeParams: (param) => {
    set((state) => ({ envelopeAmplitude: { ...state.envelopeAmplitude, ...param } }));
  }
}));
