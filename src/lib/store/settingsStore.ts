import { initPreset } from "../presets/Init";
import { create } from "zustand";
import { Preset } from "../types/types";
import { colorMap } from "../utils/colorMap";

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
  setOsc1Params: (param) => {
    set((state) => ({ osc1: { ...state.osc1, ...param } }));
  },
  setOsc2Params: (param) => {
    set((state) => ({ osc2: { ...state.osc2, ...param } }));
  },

  setNoiseParams: (param) => {
    set((state) => ({ noise: { ...state.noise, ...param } }));
  },
  setEnvAmplitudeParams: (param) => {
    set((state) => ({
      envelopeAmplitude: { ...state.envelopeAmplitude, ...param },
    }));
  },
}));

export const useWaveformColor = () =>
  useSynthSettingsStore((state) => {
    const key = `${state.osc1.type}-${state.osc2.type}`;
    return colorMap[key];
  });
