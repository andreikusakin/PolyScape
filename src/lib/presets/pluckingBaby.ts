import { Preset } from "../types/types";

export const pluckingBaby: Preset = {
  presetName: "Plucking Baby",
  author: "Andrew Kusakin",
  type: "pluck",
  osc1: {
    type: "pulse",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  osc2: {
    type: "sawtooth",
    detune: -5,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  noise: {
    type: "pink",
    volume: -7,
  },
  envelopeAmplitude: {
    attack: 0.01,
    decay: 1,
    sustain: 0,
    release: 1.5,
  },
  filter: { type: "lowpass", frequency: 0, rolloff: -24, Q: 0.01 },
  filterEnvelope: {
    attack: 0,
    decay: 0.8,
    sustain: 0,
    release: 0,
    baseFrequency: 300,
    octaves: 5,
    exponent: 5,
  },
//   miscParams: {},
  LFO1: {
    type: "sine",
    rate: "8n",
    sync: true,
    destinations: [
      { target: "osc1 fine", amount: 0.1 }
    ],
  },
  LFO2: {
    type: "square",
    rate: "8n",
    sync: true,
    destinations: [
      // { target: "osc2 fine", amount: 0.1 }
    ],
  },
  effects: [
    { type: "reverb", settings: { decay: 5, preDelay: 0.01, wet: 50 } },
    // {type: "pingPongDelay", settings: { feedback: 0.2, wet: 50, delayTime: 1 }}
  ],
};
