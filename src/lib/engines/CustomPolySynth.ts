import * as Tone from "tone/build/esm/index";
// @ts-ignore
import AudioKeys from "audiokeys";
import { Preset, LFOTarget } from "../types/types";
import NoiseEngine from "./NoiseEngine";
import { CustomVoice } from "./CustomVoice";

//TODO

// custom monosynth with noise and 2 oscs

//FIX when holding down multiple keys it stops playing if you press a new keys but not holding them, exciding 8 voices

// transpose for each oscillator
// filters for each voices
// Tone.Channel as mixer
// unison/ fix unison release

// portamento
// mimick pulse width
// make IRs for reverb
// noise
// midi and midi mapping

//lfos // LFO CHAIN

//tone start

//https://github.com/Tonejs/Tone.js/wiki/Arpeggiator

// type Preset = {
//   osc: {
//     type: "sawtooth" | "sine" | "pulse" | "triangle";
//     detune: number;
//     transpose: number;
//     pulseWidth: number;
//     volume: number;
//   };
//   osc2: {
//     type: "sawtooth" | "sine" | "pulse" | "triangle";
//     detune: number;
//     transpose: number;
//     pulseWidth: number;
//     volume: number;
//   };
//   noise: {
//     type: "white" | "pink" | "brown";
//     volume: number;
//   };
//   envelope: {
//     attack: number;
//     decay: number;
//     sustain: number;
//     release: number;
//   };
//   filter: {
//     type: "lowpass" | "highpass" | "bandpass" | "notch";
//     frequency: number;
//     rolloff: Tone.FilterRollOff;
//     Q: number;
//   };
//   filterEnvelope: {
//     attack: number;
//     decay: number;
//     sustain: number;
//     release: number;
//     baseFrequency: number;
//     octaves: number;
//     exponent: number;
//   };
//   unison: boolean;
//   panSpread: number;
// };

export default class CustomPolySynth {
  private voiceCount: number = 8;
  voices: CustomVoice[] = [];
  private activeVoices: Map<number, CustomVoice> = new Map();
  private keyboard: AudioKeys;
  unison: boolean = false;
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
  // private LFO1: Tone.LFO = new Tone.LFO("4n", -1, 1).start();
  // private LFO2: Tone.LFO = new Tone.LFO("4n", 400, 4000).start();

  constructor(node: Tone.Gain, preset: Preset) {
    this.initializeVoices(node);
    this.setupKeyboard();
    this.unison = preset.unison;

    // this.voices.forEach((v) => {
    //   if (v.oscillator2.width) {
    //     this.LFO1.connect(v.oscillator2.width);
    //   }
    // });
  }

  private initializeVoices(node: Tone.ToneAudioNode) {
    for (let i = 0; i < this.voiceCount; i++) {
      const voice = new CustomVoice();
      voice.connect(node);
      this.voices.push(voice);
      console.log(voice);
    }
  }

  private setupKeyboard() {
    this.keyboard = new AudioKeys({
      polyphony: this.voiceCount,
      rows: 1,
      priority: "last",
    });
    this.keyboard.down((key: any) => {
      const velocity = key.velocity / 127;
      console.log(key.frequency, Tone.now(), velocity);
      this.triggerAttack(key.frequency, Tone.now(), velocity);
    });

    this.keyboard.up((key: any) => {
      this.triggerRelease(key.frequency);
    });
  }

  triggerAttack(frequency: number, time: Tone.Unit.Time, velocity: number) {
    if (this.unison) {
      this.voices.forEach((v) => {
        v.triggerAttack(frequency, time, velocity);
      })
    } else {
      let voice = Array.from(this.activeVoices.values()).find(
        (v) => v.frequency.value === frequency
      );
      if (!voice) {
        voice =
          this.voices.find((v) => !this.activeVoices.has(v.frequency.value)) ||
          this.voices[0];
        this.activeVoices.set(frequency, voice);
        voice.triggerAttack(frequency, time, velocity);
      }
    }
  }

  triggerRelease(frequency: number) {
    if(this.unison) {
      this.voices.forEach((v) => {
        v.triggerRelease();
      });
    } else {
    const voice = this.activeVoices.get(frequency);
    if (voice) {
      voice.triggerRelease();
      this.activeVoices.delete(frequency);
    }}
  }

  

  //   //Set Unison

  //   setUnisonEngine(value: boolean) {
  //     //stop all voices when switching unison
  //     this.voices.forEach((v) => {
  //       v.triggerRelease();
  //     });
  //     this.unison = value;
  //   }

  //   //Set Osc Waveforms

  //   setOscTypeEngine(
  //     waveform: "sawtooth" | "sine" | "pulse" | "triangle",
  //   ) {
  //     this.voices.forEach(v => {
  //         v.set({ oscillator: { type: waveform } });
  //     });
  //   }
}
