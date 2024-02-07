import * as Tone from "tone/build/esm/index";
// @ts-ignore
import AudioKeys from "audiokeys";
import { Preset, LFOTarget, LFODestination } from "../types/types";
import NoiseEngine from "./NoiseEngine";
import { CustomVoice } from "./CustomVoice";

//TODO

//https://github.com/Tonejs/Tone.js/wiki/Arpeggiator

type LFO = {
  target: LFOTarget;
  LFO: Tone.LFO;
}

export default class CustomPolySynth {
  private voiceCount: number = 8;
  
  LFO1Destinations = [];
  LFO2Destinations: Tone.InputNode[] | undefined = [];
  voices: CustomVoice[] = [];
  osc1Transpose: number = 0;
  osc2Transpose: number = 0;
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
  LFO1: LFO[] = []
  private LFO2: Tone.LFO = new Tone.LFO({
    frequency: 0,
    type: "sine",
    amplitude: 0,
    min: 0,
    max: 0,
  });

  constructor(node: Tone.Gain, preset: Preset) {
    this.initializeVoices(node);
    this.setupKeyboard();
    this.unison = preset.unison;
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
      console.log(key);
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
      });
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
    if (this.unison) {
      this.voices.forEach((v) => {
        v.triggerRelease();
      });
    } else {
      const voice = this.activeVoices.get(frequency);
      if (voice) {
        voice.triggerRelease();
        this.activeVoices.delete(frequency);
      }
    }
  }

  setLFO1(target: LFOTarget) {
    let LFO: Tone.LFO;

    switch (target) {
      case "osc1Frequency":
        LFO = new Tone.LFO({
          frequency: 2,
          type: "sine",
          amplitude: 0.01,
          min: -2400,
          max: 2400,
        }).chain(...this.voices.map((v) => v.oscillator.detune)).start();
        this.LFO1.push({target: target, LFO: LFO});
        break;
      
      default:
        break;
    }
  }
}
