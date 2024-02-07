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
};

export default class CustomPolySynth {
  private voiceCount: number = 8;
  LFO1Destinations = [];
  LFO2Destinations: Tone.InputNode[] | undefined = [];
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
  LFO1: LFO[] = [];
  LFO2: LFO[] = [];

  constructor(node: Tone.Gain, preset: Preset) {
    this.initializeVoices(node, preset);
    this.setupKeyboard();
    this.unison = preset.unison;
  }

  private initializeVoices(node: Tone.ToneAudioNode, preset: Preset) {
    for (let i = 0; i < this.voiceCount; i++) {
      const voice = new CustomVoice();
      this.loadOsccillatorPreset(preset, voice);
      voice.connect(node);
      this.voices.push(voice);
    }
  }

  private loadOsccillatorPreset(preset: Preset, voice: CustomVoice) {
    // Load Oscillator 1 from preset
    voice.oscillator.type = preset.osc1.type;
    voice.oscillator.detune.value = preset.osc1.detune + preset.osc1.transpose * 100;
    if (voice.oscillator.width) {
      voice.oscillator.width.value = preset.osc1.pulseWidth;
    }
    voice.oscillator.volume.value = preset.osc1.volume;
    // Load Oscillator 2 from preset
    voice.oscillator2.type = preset.osc2.type;
    voice.oscillator2.detune.value = preset.osc2.detune + preset.osc2.transpose * 100;
    if (voice.oscillator2.width) {
      voice.oscillator2.width.value = preset.osc2.pulseWidth;
    }
    voice.oscillator2.volume.value = preset.osc2.volume;
    // Load Noise from preset
    voice.noise.type = preset.noise.type;
    voice.noise.volume.value = preset.noise.volume;
  }

  

  private setupKeyboard() {
    this.keyboard = new AudioKeys({
      polyphony: this.voiceCount,
      rows: 1,
      priority: "last",
    });
    this.keyboard.down((key: any) => {
      const velocity = key.velocity / 127;
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

  setLFO(target: LFOTarget, lfo: 1 | 2) {
    let LFO: Tone.LFO;
    let lfoSelected = lfo === 1 ? this.LFO1 : this.LFO2;

    switch (target) {
      case `osc${lfo}Coarse`:
        LFO = new Tone.LFO({
          min: -2400,
          max: 2400,
        })
          .chain(
            ...this.voices.map((v) =>
              lfo === 1 ? v.oscillator.detune : v.oscillator2.detune
            )
          )
          .start();
        lfoSelected.push({ target: target, LFO: LFO });
        break;
      case `osc${lfo}Fine`:
        LFO = new Tone.LFO({
          min: -100,
          max: 100,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(lfo === 1 ? v.oscillator.detune : v.oscillator2.detune);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;
      case `osc${lfo}PW`:
        LFO = new Tone.LFO({
          min: -1,
          max: 1,
        })
          .chain(
            ...this.voices.map((v) =>
              lfo === 1 ? v.oscillator.width : v.oscillator2.width
            )
          )
          .start();
        lfoSelected.push({ target: target, LFO: LFO });

        break;
      case `osc${lfo}Volume`:
        LFO = new Tone.LFO({
          min: -70,
          max: 12,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(lfo === 1 ? v.oscillator.volume : v.oscillator2.volume);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;
      case "filterCutoff":
        LFO = new Tone.LFO({
          min: 0,
          max: 20000,
        }).start();
        this.voices.forEach((voice) => {
          LFO.connect(voice.filterEnvelope.baseFrequency);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;

      default:
        break;
    }
  }
}
