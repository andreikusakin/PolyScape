import { Preset } from "../types/types";

export const initPreset: Preset = {
    osc1: {
      type: "sawtooth",
      detune: 0,
      transpose: 12,
      pulseWidth: 0,
      volume: 0,
    },
    osc2: {
      type: "triangle",
      detune: 0,
      transpose: 0,
      pulseWidth: 0,
      volume: -40,
    },
    noise: {
      type: "white",
      volume: -70,
    },
    envelope: {
      attack: 0.01,
      decay: 0.01,
      sustain: 1,
      release: 0.01,
    },
    filter: { type: "lowpass", frequency: 0, rolloff: -12, Q: 0.01 },
    filterEnvelope: {
      attack: 0,
      decay: 0.01,
      sustain: 0,
      release: 0,
      baseFrequency: 15000,
      octaves: 0,
      exponent: 5,
    },
    unison: false,
    panSpread: 0,
    volume: 0,
    LFO1: {
      type: "sine",
      rate: "8n",
      sync: true,
      destinations: [
        // { target: "osc1 fine", amount: 0.1 }
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
    effects: 
      [{type: "reverb", settings: { decay: 5, preDelay: 0.01, wet: 50 }},
      {type: "pingPongDelay", settings: { feedback: 0.2, wet: 50, delayTime: 1 }}
      ]
  };