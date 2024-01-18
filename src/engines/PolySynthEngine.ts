import * as Tone from "tone/build/esm/index";
// @ts-ignore
import AudioKeys from "audiokeys";

//TODO

// transpose for each oscillator
// filters for each voices
// Tone.Channel as mixer
// unison/ fix unison release

// portamento
// pulse width
// make IRs for reverb
// noise
// midi and midi mapping

//combine methods for both oscs

//mimick detune and panspread

//mixer mimick

class PolySynthEngine {
  private voiceCount: number = 8;
  private voices: [Tone.MonoSynth, Tone.MonoSynth][] = [];
  private panners: Tone.Panner[] = [];
  private activeVoices: Map<number, number> = new Map();
  private lastPlayedVoice: number = 0;
  private keyboard: AudioKeys;
  private unison: boolean = false;
  private maxDetuneOSC: number[][] = [
    [31, -49, 49, -45, 24, -40, 42, -32],
    [-41, 38, -25, 49, 15, -49, 18, 39],
  ];
  private currentDetuneOSCValues: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  private maxPanSpreadPerVoice: number[] = [
    -0.7, 0.1, -1, 0.9, -0.7, 0.2, -0.8, 1,
  ];

  constructor(node: Tone.Gain<"decibels" | "gain" | "normalRange">) {
    for (let i = 0; i < this.voiceCount; i++) {
      this.panners.push(new Tone.Panner().connect(node));
      this.voices.push([
        new Tone.MonoSynth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.01 },
          filter: { type: "lowpass", frequency: 0, rolloff: -12, Q: 0 },
          filterEnvelope: {
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
            baseFrequency: 15000,
            octaves: 0,
            exponent: 5,
          },
        }).connect(this.panners[i]),
        new Tone.MonoSynth({
          oscillator: { type: "sine", phase: 0 },
          envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.01 },
          filter: { type: "lowpass", frequency: 0, rolloff: -12, Q: 0 },
          filterEnvelope: {
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
            baseFrequency: 15000,
            octaves: 0,
            exponent: 5,
          },
          detune: 0,
        }).connect(this.panners[i]),
      ]);
    }

    console.log(this.voices);

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

  setUnisonEngine(value: boolean) {
    this.unison = value;
  }

  private triggerAttackEngine(
    frequency: number,
    time: Tone.Unit.Time,
    velocity: number
  ) {
    if (this.unison) {
      this.voices.forEach(([osc1, osc2]) => {
        osc1.triggerAttack(frequency, time, velocity);
        osc2.triggerAttack(frequency, time, velocity);
      });
    } else {
      this.lastPlayedVoice = (this.lastPlayedVoice + 1) % this.voiceCount;
      const voicePair = this.voices[this.lastPlayedVoice];
      const [osc1, osc2] = voicePair;
      osc1.triggerAttack(frequency, time, velocity);
      osc2.triggerAttack(frequency, time, velocity);
      this.activeVoices.set(this.lastPlayedVoice, frequency);
    }
  }

  private triggerReleaseEngine(frequency: number) {
    if (this.unison) {
      this.voices.forEach(([osc1, osc2]) => {
        osc1.triggerRelease();
        osc2.triggerRelease();
      });
    } else {
      this.activeVoices.forEach((freq, voiceIndex) => {
        if (freq === frequency) {
          const voicePair = this.voices[voiceIndex];
          const [osc1, osc2] = voicePair;
          osc1.triggerRelease();
          osc2.triggerRelease();
          this.activeVoices.delete(voiceIndex);
        }
      });
    }
  }

  //Set Waveforms

  setOscTypeEngine(
    waveform: "sawtooth" | "sine" | "pulse" | "triangle",
    osc: number
  ) {
    this.voices.forEach(([osc1, osc2]) => {
      if (osc === 1) {
        osc1.set({ oscillator: { type: waveform } });
      } else {
        osc2.set({ oscillator: { type: waveform } });
      }
    });
  }

  //Set Detune

  setOscDetuneEngine(detune: number, osc: number) {
    const oscIndex = osc - 1;
    for (let i = 0; i < this.voiceCount; i++) {
      const maxDetune = this.maxDetuneOSC[oscIndex][i];
      const currentDetune = this.voices[i][oscIndex].detune.value;
      const step = Math.round(currentDetune / 100);
      const detuneAmount = maxDetune * (detune / 100);
      this.currentDetuneOSCValues[oscIndex][i] = detuneAmount;
      this.voices[i][oscIndex].detune.value = detuneAmount + step * 100;
      console.log(this.voices[i][0].detune.value + " detuned value OSC" + osc);
    }
  }

  //Set Transpose

  setOscTransposeEngine(transpose: number, osc: number) {
    const oscIndex = osc - 1;
    for (let i = 0; i < this.voices.length; i++) {
      const transposedValue =
        transpose * 100 + this.currentDetuneOSCValues[oscIndex][i];
      this.voices[i][oscIndex].detune.value = transposedValue;
      console.log(`OSC${oscIndex} transposed by ${transpose} semitones`);
    }
  }

  //Set Pan Spread

  setPanSpreadEngine(panSpread: number) {
    for (let i = 0; i < this.voiceCount; i++) {
      const panValue = this.maxPanSpreadPerVoice[i] * (panSpread / 100);
      this.panners[i].pan.linearRampTo(panValue, 0.01);
    }
  }

  //Set Envelope Amplitude

  setAttackEngine(newAttack: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ envelope: { attack: newAttack } });
      osc2.set({ envelope: { attack: newAttack } });
    });
  }

  setDecayEngine(newDecay: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ envelope: { decay: newDecay } });
      osc2.set({ envelope: { decay: newDecay } });
    });
  }

  setSustainEngine(newSustain: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ envelope: { sustain: newSustain } });
      osc2.set({ envelope: { sustain: newSustain } });
    });
  }

  setReleaseEngine(newRelease: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ envelope: { release: newRelease } });
      osc2.set({ envelope: { release: newRelease } });
    });
  }

  //Set Filter

  setFilterTypeEngine(
    filterType: "lowpass" | "highpass" | "bandpass" | "notch"
  ) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filter: { type: filterType } });
      osc2.set({ filter: { type: filterType } });
    });
  }

  setFilterFrequencyEngine(newFrequency: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filter: { frequency: newFrequency } });
      osc2.set({ filter: { frequency: newFrequency } });
    });
  }

  setFilterQEngine(newQ: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filter: { Q: newQ } });
      osc2.set({ filter: { Q: newQ } });
    });
  }

  setFilterRollOffEngine(newRollOff: Tone.FilterRollOff) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filter: { rolloff: newRollOff } });
      osc2.set({ filter: { rolloff: newRollOff } });
    });
  }

  //Set Envelope Filter

  setFilterEnvelopeAttackEngine(newAttack: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { attack: newAttack } });
      osc2.set({ filterEnvelope: { attack: newAttack } });
    });
  }

  setFilterEnvelopeDecayEngine(newDecay: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { decay: newDecay } });
      osc2.set({ filterEnvelope: { decay: newDecay } });
    });
  }

  setFilterEnvelopeSustainEngine(newSustain: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { sustain: newSustain } });
      osc2.set({ filterEnvelope: { sustain: newSustain } });
    });
  }

  setFilterEnvelopeReleaseEngine(newRelease: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { release: newRelease } });
      osc2.set({ filterEnvelope: { release: newRelease } });
    });
  }

  setFilterEnvelopeFrequencyEngine(newFrequency: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { baseFrequency: newFrequency } });
      osc2.set({ filterEnvelope: { baseFrequency: newFrequency } });
    });
  }

  setFilterEnvelopeExponentEngine(newExponent: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { exponent: newExponent } });
      osc2.set({ filterEnvelope: { exponent: newExponent } });
    });
  }

  setFilterEnvelopeOctavesEngine(newOctaves: number) {
    this.voices.forEach(([osc1, osc2]) => {
      osc1.set({ filterEnvelope: { octaves: newOctaves } });
      osc2.set({ filterEnvelope: { octaves: newOctaves } });
    });
  }
}

export default PolySynthEngine;
