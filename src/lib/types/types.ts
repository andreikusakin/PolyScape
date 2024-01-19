import * as Tone from "tone/build/esm/index";

export type Preset = {
    osc1: {
      type: "sawtooth" | "sine" | "pulse" | "triangle";
      detune: number;
      transpose: number;
      pulseWidth: number;
    };
    osc2: {
      type: "sawtooth" | "sine" | "pulse" | "triangle";
      detune: number;
      transpose: number;
      pulseWidth: number;
    };
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
    filter: {
      type: "lowpass" | "highpass" | "bandpass" | "notch";
      frequency: number;
      rolloff: Tone.FilterRollOff;
      Q: number;
    };
    filterEnvelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
      baseFrequency: number;
      octaves: number;
      exponent: number;
    };
    unison: boolean;
    panSpread: number;
  };
  
  