import { Preset } from "../types/types";

export const initPreset: Preset = {
    osc1: {
      type: "sawtooth",
      detune: 0,
      transpose: 0,
      pulseWidth: 0,
      volume: 0,
    },
    osc2: {
      type: "pulse",
      detune: 0,
      transpose: 0,
      pulseWidth: 0,
      volume: -40,
    },
    noise: {
      type: "white",
      volume: -70,
    },
    envelopeAmplitude: {
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
    detune: 0,
    panSpread: 0,
    masterVolume: 0,
    hold: false,
    LFO1: {
      type: "sine",
      rate: "8n",
      sync: true,
      destinations: [

      ],
    },
    LFO2: {
      type: "square",
      rate: "8n",
      sync: true,
      destinations: [

      ],
    },
    effects: 
      [{type: "reverb", settings: { decay: 5, preDelay: 0.01, wet: 50 }},
      ]
  };