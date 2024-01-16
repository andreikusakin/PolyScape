import * as Tone from "tone/build/esm/index";
// @ts-ignore
import AudioKeys from "audiokeys";

class PolySynthEngine {
  private voiceCount: number;
  public OSC1Voices: Tone.Synth[];
  private OSC2Voices: Tone.Synth[];
  private osc1Type: "sawtooth" | "sine" | "square" | "triangle";
  private osc2Type: "sawtooth" | "sine" | "square" | "triangle";
  private activeVoicesOSC1: Map<Tone.Synth, number>;
  private activeVoicesOSC2: Map<Tone.Synth, number>;
  private keyboard: AudioKeys;

  constructor(
    voiceCount: number,
    node: Tone.Gain<"decibels" | "gain" | "normalRange">,
    osc1Type: "sawtooth" | "sine" | "square" | "triangle",
    osc2Type: "sawtooth" | "sine" | "square" | "triangle"
  ) {
    this.voiceCount = voiceCount;
    this.OSC1Voices = [];
    this.OSC2Voices = [];
    this.osc1Type = osc1Type;
    this.osc2Type = osc2Type;
    this.activeVoicesOSC1 = new Map();
    this.activeVoicesOSC2 = new Map();
    for (let i = 0; i < voiceCount; i++) {
      this.OSC1Voices.push(
        new Tone.Synth({
          oscillator: { type: this.osc1Type },
          volume: -24,
        }).connect(node)
      );
      this.OSC2Voices.push(
        new Tone.Synth({
          oscillator: { type: this.osc2Type },
          volume: -24,
        }).connect(node)
      );
    }
    this.keyboard = new AudioKeys({
      polyphony: this.voiceCount,
      rows: 1,
      priority: "last",
    });
    this.keyboard.down((key: any) => {
      const velocity = key.velocity / 127;
      this.triggerAttackEngine(key.frequency, Tone.now(), velocity);
    });

    this.keyboard.up((key: any) => {
      this.triggerReleaseEngine(key.frequency);
    });
  }

  triggerAttackEngine(frequency: number, time, velocity: number) {
    const voice1 =
      this.OSC1Voices.find((v) => !this.activeVoicesOSC1.has(v)) ||
      this.OSC1Voices[0];
    voice1.triggerAttack(frequency, time, velocity);
    this.activeVoicesOSC1.set(voice1, frequency);

    const voice2 =
      this.OSC2Voices.find((v) => !this.activeVoicesOSC2.has(v)) ||
      this.OSC2Voices[0];
    voice2.triggerAttack(frequency, time, velocity);
    this.activeVoicesOSC2.set(voice2, frequency);
  }

  triggerReleaseEngine(frequency: number) {
    this.activeVoicesOSC1.forEach((freq, voice) => {
      if (freq === frequency) {
        voice.triggerRelease();
        this.activeVoicesOSC1.delete(voice);
      }
    });

    this.activeVoicesOSC2.forEach((freq, voice) => {
      if (freq === frequency) {
        voice.triggerRelease();
        this.activeVoicesOSC2.delete(voice);
      }
    });
  }

  //Set Waveforms

  setOsc1Type(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.OSC1Voices.forEach((v) => v.set({ oscillator: { type: waveform } }));
  }

  setOsc2Type(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.OSC2Voices.forEach((v) => v.set({ oscillator: { type: waveform } }));
  }

  //Set Envelope

  setAttack(attack: number) {
    this.OSC1Voices.forEach((v) => v.set({ envelope: { attack } }));
    this.OSC2Voices.forEach((v) => v.set({ envelope: { attack } }));
  }

  setDecay(decay: number) {
    this.OSC1Voices.forEach((v) => v.set({ envelope: { decay } }));
    this.OSC2Voices.forEach((v) => v.set({ envelope: { decay } }));
  }

  setSustain(sustain: number) {
    this.OSC1Voices.forEach((v) => v.set({ envelope: { sustain } }));
    this.OSC2Voices.forEach((v) => v.set({ envelope: { sustain } }));
  }

  setRelease(release: number) {
    this.OSC1Voices.forEach((v) => v.set({ envelope: { release } }));
    this.OSC2Voices.forEach((v) => v.set({ envelope: { release } }));
  }
}

export default PolySynthEngine;