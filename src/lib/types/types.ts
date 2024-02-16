import * as Tone from "tone/build/esm/index";

export type Preset = {
  osc1: {
    type: "sawtooth" | "sine" | "pulse" | "triangle";
    detune: number;
    transpose: number;
    pulseWidth: number;
    volume: number;
  };
  osc2: {
    type: "sawtooth" | "sine" | "pulse" | "triangle";
    detune: number;
    transpose: number;
    pulseWidth: number;
    volume: number;
  };
  noise: {
    type: "white" | "pink" | "brown";
    volume: number;
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
  volume: number;
  LFO1?: {
    type: "sine" | "triangle" | "sawtooth" | "square";
    rate: Tone.Unit.Frequency;
    sync: boolean;
    destinations: {target: LFOTarget, amount: number}[];
  };
  LFO2?: {
    type: "sine" | "triangle" | "sawtooth" | "square";
    rate: Tone.Unit.Frequency;
    sync: boolean;
    destinations: {target: LFOTarget, amount: number}[];
  };
  effects?:{
    reverb?: {
      decay: number;
      wet: number;
      preDelay: number;
    };
    feedbackDelay?: {
      delayTime: Tone.Unit.Time;
      feedback: number;
      wet: number;
    };
    
  }
  
};

export type LFOTarget =
  | "osc1 coarse"
  | "osc1 fine"
  | "osc1 pulse width"
  | "osc1 volume"
  | "osc2 coarse"
  | "osc2 fine"
  | "osc2 pulse width"
  | "osc2 volume"
  | "noise volume"
  | "filter cutoff"
  | "filter resonance"
  | "envelope amount"
  | "filter attack"
  | "filter decay"
  | "filter sustain"
  | "filter release"
  | "envelope attack"
  | "envelope decay"
  | "envelope sustain"
  | "envelope release";

export type LFODestination = {
  target: string;
  amount: number;
  setAmount: (amount: number) => void;
  minLFO: number;
  maxLFO: number;
};
