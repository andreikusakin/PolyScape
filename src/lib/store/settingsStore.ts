import { initPreset } from "../presets/init";
import { create } from "zustand";
import { Preset } from "../types/types";
import { colorMap } from "../utils/colorMap";
import CustomPolySynth from "../engines/CustomPolySynth";
import CustomEffects from "../engines/CustomEffects";
import * as Tone from "tone/build/esm/index";

type SynthSettingsStore = {
  preset: Preset;
  osc1: Preset["osc1"];
  osc2: Preset["osc2"];
  noise: Preset["noise"];
  filter: Preset["filter"];
  filterEnvelope: Preset["filterEnvelope"];
  envelopeAmplitude: Preset["envelopeAmplitude"];
  isSelectingLFO: 1 | 2 | false;
  fxSettings: Preset["effects"];
  lfo1: Preset["LFO1"];
  lfo2: Preset["LFO2"];
  panSpread: Preset["panSpread"];
  unison: Preset["unison"];
  detune: Preset["detune"];
  masterVolume: Preset["masterVolume"];
  hold: Preset["hold"];
  aggregateSettings: () => Preset;
};

export const useSynthEngineStore = create((set) => ({
  synthEngine: undefined as CustomPolySynth | undefined,
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

export const useSynthSettingsStore = create<SynthSettingsStore>((set, get) => ({
  preset: initPreset,
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
  panSpread: initPreset.panSpread,
  unison: initPreset.unison,
  detune: initPreset.detune,
  masterVolume: initPreset.masterVolume,
  hold: initPreset.hold,

  aggregateSettings: () => {
    return {
      osc1: get().osc1,
      osc2: get().osc2,
      noise: get().noise,
      envelopeAmplitude: get().envelopeAmplitude,
      filter: get().filter,
      filterEnvelope: get().filterEnvelope,
      unison: get().unison,
      detune: get().detune,
      panSpread: get().panSpread,
      masterVolume: get().masterVolume,
      hold: get().hold,
      LFO1: get().lfo1,
      LFO2: get().lfo2,
      effects: get().fxSettings,
      
    };
  },

  updateHold: () => {
    set((state) => ({ hold: !state.hold }));
  },
  updateUnison: () => {
    set((state) => ({ unison: !state.unison }));
  },
  setDetune: (value: number) => {
    set(() => ({ detune: value }));
  },
  setMasterVolume: (value: number) => {
    set(() => ({ masterVolume: value }));
  },

  setAllParamsFromPreset: (preset: Preset) => {
    set({
      osc1: preset.osc1,
      osc2: preset.osc2,
      noise: preset.noise,
      filter: preset.filter,
      filterEnvelope: preset.filterEnvelope,
      envelopeAmplitude: preset.envelopeAmplitude,
      unison: preset.unison,
      detune: preset.detune,
      masterVolume: preset.masterVolume,
      hold: preset.hold,
      lfo1: preset.LFO1,
      lfo2: preset.LFO2,
      fxSettings: preset.effects,
    });
  },
  setOsc1Params: (param: Preset["osc1"]) => {
    set((state) => ({ osc1: { ...state.osc1, ...param } }));
  },
  setOsc2Params: (param: Preset["osc2"]) => {
    set((state) => ({ osc2: { ...state.osc2, ...param } }));
  },

  setNoiseParams: (param: Preset["noise"]) => {
    set((state) => ({ noise: { ...state.noise, ...param } }));
  },
  setFilterParams: (param: Preset["filter"]) => {
    set((state) => ({ filter: { ...state.filter, ...param } }));
  },
  setFilterEnvelopeParams: (param: Preset["filterEnvelope"]) => {
    set((state) => ({
      filterEnvelope: { ...state.filterEnvelope, ...param },
    }));
  },
  setEnvAmplitudeParams: (param: Preset["envelopeAmplitude"]) => {
    set((state) => ({
      envelopeAmplitude: { ...state.envelopeAmplitude, ...param },
    }));
  },
  setPanSpread: (param: Preset["panSpread"]) => {
    set((state) => ({ panSpread: param }));
  },
  setLFO1Params: (param: Preset["LFO1"]) => {
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
    lfoNumber === 1
      ? set((state) => ({
          lfo1: {
            ...state.lfo1,
            destinations: [
              ...state.lfo1.destinations,
              { target: target, amount: 0.5 },
            ],
          },
        }))
      : set((state) => ({
          lfo2: {
            ...state.lfo2,
            destinations: [
              ...state.lfo2.destinations,
              { target: target, amount: 0.5 },
            ],
          },
        }));
    set(() => ({ isSelectingLFO: false }));
  },
  setFxSettings: (settings: Preset["effects"]) => {
    set(() => ({ fxSettings: settings }));
  },

  setIsSelectingLFO: (lfo: 1 | 2 | false) => {
    set(() => ({ isSelectingLFO: lfo }));
  },
}));
