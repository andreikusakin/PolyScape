import * as Tone from "tone/build/esm/index";
import CustomEffects from "../engines/CustomEffects";

export type ReverbSettings = {
  decay: number;
  wet: Tone.Unit.NormalRange;
  preDelay: number;
};

export type PingPongDelaySettings = {
  feedback: number;
  wet: Tone.Unit.NormalRange;
  delayTime: Tone.Unit.Time;
};

export type FeedbackDelaySettings = {
  feedback: number;
  wet: Tone.Unit.NormalRange;
  delayTime: Tone.Unit.Time;
};

export type DistortionSettings = {
  distortion: number;
  wet: number;
};

export type ChorusSettings = {
  frequency: Tone.Unit.Frequency;
  delayTime: Tone.Unit.Milliseconds;
  depth: Tone.Unit.NormalRange;
  feedback: Tone.Unit.NormalRange;
  wet: number;
};

export type BitCrusherSettings = {
  bits: number;
  wet: number;
};

export type Effect = {
  type: string;
  settings:
    | ReverbSettings
    | PingPongDelaySettings
    | FeedbackDelaySettings
    | DistortionSettings
    | ChorusSettings
    | BitCrusherSettings;

};

export type ColorMap = {
  [key: string]: number[];
};

export type LFO = {
  type?: "sine" | "triangle" | "sawtooth" | "square";
  rate?: Tone.Unit.Frequency;
  sync?: boolean;
  destinations: { target: LFOTarget; amount: number }[];
};

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
  envelopeAmplitude: {
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
  masterVolume: number;
  detune: number;
  hold: boolean;
  LFO1: LFO;
  LFO2: LFO;
  effects: Effect[];
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

export type fxProps = {
  engine: CustomEffects;
  settings: Preset["effects"];
  updateSettings: (settings: Preset["effects"]) => void;
  index: number;
};

export type UiSettings = {
  isKeyboardOpen: boolean;
  isFxOpen: boolean;
  isUiVisible: boolean;
};
