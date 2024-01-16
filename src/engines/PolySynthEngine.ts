import * as Tone from "tone/build/esm/index";
// @ts-ignore
import AudioKeys from "audiokeys";

//TODO

// transpose for each oscillator
// filters for each voices
// Tone.Channel as mixer

class PolySynthEngine {
  private voiceCount: number = 8;
  private OSC1Voices: Tone.Synth[];
  private OSC2Voices: Tone.Synth[];
  private activeVoicesOSC1: Map<Tone.Synth, number>;
  private activeVoicesOSC2: Map<Tone.Synth, number>;
  private OSC1Transpose: number = 0;
  private OSC2Transpose: number = 0;
  private OSC1Panners: Tone.Panner[];
  private OSC2Panners: Tone.Panner[];
  private OSC1Filters: Tone.Filter[];
  private OSC2Filters: Tone.Filter[];
  private keyboard: AudioKeys;
  
  

  constructor(
    node: Tone.Gain<"decibels" | "gain" | "normalRange">,
  ) {
    this.OSC1Voices = [];
    this.OSC2Voices = [];
    this.OSC1Panners = [];
    this.OSC2Panners = [];
    this.OSC1Transpose;
    this.OSC2Transpose;
    this.activeVoicesOSC1 = new Map();
    this.activeVoicesOSC2 = new Map();
    for (let i = 0; i < this.voiceCount; i++) {
      this.OSC1Panners.push(new Tone.Panner().connect(node));
      this.OSC1Voices.push(
        new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.01},
        }).connect(this.OSC1Panners[i])
      );
      this.OSC2Panners.push(new Tone.Panner().connect(node));
      this.OSC2Voices.push(
        new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.01},
        }).connect(this.OSC2Panners[i])
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

  setOsc1TypeEngine(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.OSC1Voices.forEach((v: Tone.Synth) => v.set({ oscillator: { type: waveform } }));
  }

  setOsc2TypeEngine(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.OSC2Voices.forEach((v) => v.set({ oscillator: { type: waveform } }));
  }

  //Set Detune

  setOsc1DetuneEngine(detune: number) {
    for (let i = 0; i < this.OSC1Voices.length; i++) {
      const currentDetune = this.OSC1Voices[i].detune.value;
      const reminder = currentDetune - (currentDetune % 100);
      console.log(reminder + " reminder")
      const detunedValue = reminder + Math.floor((Math.random() * 60 - 30) * detune / 100);
      
      this.OSC1Voices[i].detune.value = detunedValue;
      console.log(detunedValue + " detuned value")
    }
  }

  setOsc2DetuneEngine(detune: number) {
    for (let i = 0; i < this.OSC2Voices.length; i++) {

      const detunedValue = Math.floor((Math.random() * 60 - 30) * detune / 100);
      console.log(detunedValue);
      this.OSC2Voices[i].detune.value = detunedValue;
    }
  }

  //Set Transpose

  setOsc1TransposeEngine(transpose: number) {
    for (let i = 0; i < this.OSC1Voices.length; i++) {
      const currentDetune = this.OSC1Voices[i].detune.value;
      const detune = currentDetune % 100;
      const transposedValue = transpose * 100 + detune;
      this.OSC1Voices[i].detune.value = transposedValue;
      console.log(this.OSC1Voices[i].detune.value + " transposed")
    }
  }

  setOsc2TransposeEngine(transpose: number) {
    for (let i = 0; i < this.OSC2Voices.length; i++) {
      const currentFrequency = this.OSC2Voices[i].detune.value;
      const detune = currentFrequency % 100;
      const transposedValue = transpose * 100 + detune;
      this.OSC2Voices[i].detune.value = transposedValue;
    }
  }

  //Set Pan Spread

  setPanSpreadEngine(panSpread: number) {
    for (let i = 0; i < this.OSC1Panners.length; i++) {
      const randomNumber1 = (Math.random() * 2 - 1) * (panSpread / 100)
      const randomNumber2 = (Math.random() * 2 - 1) * (panSpread / 100)
      console.log(randomNumber1) 
      this.OSC1Panners[i].pan.linearRampTo(randomNumber1, 0.01);
      this.OSC2Panners[i].pan.linearRampTo(randomNumber2, 0.01);
    }
  }

  //Set Envelope

  setAttackEngine(newAttack: number) {
    this.OSC1Voices.forEach((v) => v.set({ envelope: { attack: newAttack } }));
    this.OSC2Voices.forEach((v) => v.set({ envelope: { attack: newAttack } }));
  }

  setDecayEngine(newDecay: number) {
    this.OSC1Voices.forEach((v) => v.set({ envelope: { decay: newDecay } }));
    this.OSC2Voices.forEach((v) => v.set({ envelope: { decay: newDecay } }));
  }

  setSustainEngine(newSustain: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ envelope: { sustain: newSustain } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ envelope: { sustain: newSustain } })
    );
  }

  setReleaseEngine(newRelease: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ envelope: { release: newRelease } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ envelope: { release: newRelease } })
    );
  }
}

export default PolySynthEngine;
