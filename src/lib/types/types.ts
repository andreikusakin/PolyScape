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
  }
};

export type LFOTarget =
  | "osc1Coarse"
  | "osc1Fine"
  | "osc1PW"
  | "osc1Volume"
  | "osc2Coarse"
  | "osc2Fine"
  | "osc2PW"
  | "osc2Volume"
  | "noiseVolume"
  | "filterCutoff"
  | "filterResonance"
  | "filterEnvAmount"
  | "filterEnvAttack"
  | "filterEnvDecay"
  | "filterEnvSustain"
  | "filterEnvRelease"
  | "envelopeAttack"
  | "envelopeDecay"
  | "envelopeSustain"
  | "envelopeRelease";

export type LFODestination = {
  target: string;
  amount: number;
  setAmount: (amount: number) => void;
  minLFO: number;
  maxLFO: number;
};
