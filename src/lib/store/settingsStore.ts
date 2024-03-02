import { initPreset } from "../presets/Init";
import { create } from "zustand";
import { Preset } from "../types/types";
import { colorMap } from "../utils/colorMap";
import CustomPolySynth from "../engines/CustomPolySynth";
import CustomEffects from "../engines/CustomEffects";
import * as Tone from "tone/build/esm/index";

export const useSynthEngineStore = create((set) => ({
  synthEngine: undefined,
  setSynthEngine: (engine: CustomPolySynth) => {
    set({ synthEngine: engine });
  },
}));

export const useEffectsEngineStore = create((set) => ({
  effectsEngine: undefined,
  setEffectsEngine: (engine: CustomEffects) => {
    set({ effectsEngine: engine });
  },
}));

export const useSynthSettingsStore = create((set, get) => ({
  presetName: initPreset.presetName,
  osc1: initPreset.osc1,
  osc2: initPreset.osc2,
  noise: initPreset.noise,
  filter: initPreset.filter,
  filterEnvelope: initPreset.filterEnvelope,
  envelopeAmplitude: initPreset.envelopeAmplitude,
  isSelectingLFO: false,
  fxSettings: initPreset.effects,
  lfo1: initPreset.LFO1,
  lfo2: initPreset.LFO2,
  setAllParamsFromPreset: (preset: Preset) => {
    set({
      presetName: preset.presetName,
      osc1: preset.osc1,
      osc2: preset.osc2,
      noise: preset.noise,
      filter: preset.filter,
      filterEnvelope: preset.filterEnvelope,
      envelopeAmplitude: preset.envelopeAmplitude,
      lfo1: preset.LFO1,
      lfo2: preset.LFO2,
      fxSettings: preset.effects,
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
  setFilterParams: (param) => {
    set((state) => ({ filter: { ...state.filter, ...param } }));
  },
  setFilterEnvelopeParams: (param) => {
    set((state) => ({
      filterEnvelope: { ...state.filterEnvelope, ...param },
    }));
  },
  setEnvAmplitudeParams: (param) => {
    set((state) => ({
      envelopeAmplitude: { ...state.envelopeAmplitude, ...param },
    }));
  },
  setLFO1Params: (param) => {
    set((state) => ({ lfo1: { ...state.lfo1, ...param } }));
  },
  setLFO2Params: (param) => {
    set((state) => ({ lfo2: { ...state.lfo2, ...param } }));
  },
  assignLFOToTarget: (target: string, currentValue?: number) => {
    const lfoNumber = get().isSelectingLFO;
    const synthEngine = useSynthEngineStore.getState().synthEngine;
    const currentRate = lfoNumber === 1 ? get().lfo1.rate : get().lfo2.rate;
    synthEngine.setLFO(target, lfoNumber, currentValue, currentRate);
    lfoNumber === 1 ?
    set((state) => ({
      lfo1: { ...state.lfo1, destinations: [...state.lfo1.destinations, { target: target, amount: 0.5 }] },
     })) : 
    set((state) => ({
      lfo2: { ...state.lfo2, destinations: [...state.lfo2.destinations, { target: target, amount: 0.5 }] },
    }));
    set(() => ({ isSelectingLFO: false }));
  },
  setFxSettings: (settings) => {
    set(() => ({ fxSettings: settings }));
  },

  setIsSelectingLFO: (lfo: 1 | 2 | false) => {
    set(() => ({ isSelectingLFO: lfo }));
  },
}));

export const useWaveformColor = () =>
  useSynthSettingsStore((state) => {
    const key = `${state.osc1.type}-${state.osc2.type}`;
    return colorMap[key];
  });
