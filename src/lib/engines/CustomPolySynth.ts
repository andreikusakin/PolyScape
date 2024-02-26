import * as Tone from "tone/build/esm/index";
import { WebMidi } from "webmidi";
// @ts-ignore
import AudioKeys from "audiokeys";
import { Preset, LFOTarget, LFODestination } from "../types/types";
import NoiseEngine from "./NoiseEngine";
import { CustomVoice } from "./CustomVoice";

//TODO

//pan spread, midi keyboard, unison

//https://github.com/Tonejs/Tone.js/wiki/Arpeggiator

//fix voice allocation

type LFO = {
  target: LFOTarget;
  LFO: Tone.LFO;
  gain?: Tone.Gain;
};

export default class CustomPolySynth {
  isMidiSupported: boolean = false;
  midiInputIndex = 0;
  midiInputs;
  midiInput;
  private voiceCount: number = 16;
  voices: CustomVoice[] = [];
  private activeVoices: Map<number, CustomVoice> = new Map();
  private keyboard: AudioKeys;
  unison: boolean = false;
  LFO1: LFO[] = [];
  LFO2: LFO[] = [];
  private preset: Preset;
  readonly outputNode: Tone.Gain;

  constructor(preset: Preset) {
    this.preset = preset;
    this.outputNode = new Tone.Gain({ gain: 0.2 });
    this.initializeVoices(this.outputNode, preset);
    this.loadFilterPreset(preset);
    this.loadLFOs(preset);
    this.setupKeyboard();
    if (navigator.userAgent.includes("Chrome")) {
      this.setupMidi();
    }

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
    voice.oscillator.detune.value =
      preset.osc1.detune + preset.osc1.transpose * 100;
    if (voice.oscillator.width) {
      voice.oscillator.width.value = preset.osc1.pulseWidth;
    }
    voice.oscillator.volume.value = preset.osc1.volume;
    // Load Oscillator 2 from preset
    voice.oscillator2.type = preset.osc2.type;
    voice.oscillator2.detune.value =
      preset.osc2.detune + preset.osc2.transpose * 100;
    if (voice.oscillator2.width) {
      voice.oscillator2.width.value = preset.osc2.pulseWidth;
    }
    voice.oscillator2.volume.value = preset.osc2.volume;
    // Load Noise from preset
    voice.noise.type = preset.noise.type;
    voice.noise.volume.value = preset.noise.volume;
    // Load Envelope from preset
    voice.envelope.attack = preset.envelope.attack;
    voice.envelope.decay = preset.envelope.decay;
    voice.envelope.sustain = preset.envelope.sustain;
    voice.envelope.release = preset.envelope.release;
  }

  private loadFilterPreset(preset: Preset) {
    this.voices.forEach((v) => {
      v.filter.type = preset.filter.type;
      v.filter.frequency.value = preset.filter.frequency;
      v.filter.Q.value = preset.filter.Q;
      v.filter.rolloff = preset.filter.rolloff;
      v.filterEnvelope.attack = preset.filterEnvelope.attack;
      v.filterEnvelope.decay = preset.filterEnvelope.decay;
      v.filterEnvelope.sustain = preset.filterEnvelope.sustain;
      v.filterEnvelope.release = preset.filterEnvelope.release;
      v.filterEnvelope.baseFrequency = preset.filterEnvelope.baseFrequency;
    });
  }

  private loadLFOs(preset: Preset) {
    if (preset.LFO1) {
      preset.LFO1.destinations.forEach((p) => {
        this.setLFO(p.target, 1, p.amount);
        this.LFO1.forEach((lfo) => {
          lfo.LFO.set({
            type: preset.LFO1?.type,
            frequency: preset.LFO1?.rate,
          });
        });
        this.LFO1.find((lfo) => lfo.target === p.target)?.LFO.set({
          amplitude: p.amount,
        });
      });
    }
    if (preset.LFO2) {
      preset.LFO2.destinations.forEach((p) => {
        this.setLFO(p.target, 2, p.amount);
        this.LFO2.forEach((lfo) => {
          lfo.LFO.set({
            type: preset.LFO2?.type,
            frequency: preset.LFO2?.rate,
          });
        });
        this.LFO2.find((lfo) => lfo.target === p.target)?.LFO.set({
          amplitude: p.amount,
        });
      });
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
      this.triggerAttack(key.frequency, Tone.now(), velocity);
    });

    this.keyboard.up((key: any) => {
      this.triggerRelease(key.frequency);
    });
  }

  private setupMidi() {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log(WebMidi.inputs);
        this.isMidiSupported = true;
        if (WebMidi.inputs.length < 1) {
          console.log("No MIDI devices detected");
          return;
        }
        this.midiInputs = WebMidi.inputs;
        this.midiInput = WebMidi.inputs[this.midiInputIndex];
        this.midiListener(this.midiInput);
      }
    });
  }

  setMidiInputByIndex(index: number) {
    this.midiInputIndex = index;
    this.midiInput.destroy();
    this.midiInput = WebMidi.inputs[index];
    this.midiListener(this.midiInput);
    
  }

  midiListener(input) {
    input.addListener("noteon", "all", (e) => {
      const frequency = Tone.Frequency(e.note.number, "midi").toFrequency();
      this.triggerAttack(frequency, Tone.now(), e.velocity);
    });
    input.addListener("noteoff", "all", (e) => {
      const frequency = Tone.Frequency(e.note.number, "midi").toFrequency();
      this.triggerRelease(frequency);
    });
  }

  getMidiInputs() {
    return WebMidi.inputs;
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

  setLFO(
    target: LFOTarget,
    lfo: 1 | 2,
    currentValue?: number,
    rate?: number | string
  ) {
    let LFO: Tone.LFO;
    let gain: Tone.Gain;
    let lfoSelected = lfo === 1 ? this.LFO1 : this.LFO2;

    switch (target) {
      case `osc1 coarse`:
        gain = new Tone.Gain();
        LFO = new Tone.LFO({
          min:
            -2400 +
            (currentValue ? currentValue : this.preset.osc1.transpose) * 100,
          max:
            2400 +
            (currentValue ? currentValue : this.preset.osc1.transpose) * 100,
          amplitude: 0.5,
          frequency: rate,
        }).start();
        Tone.connect(LFO, gain);
        this.voices.forEach((v) => {
          gain.connect(v.oscillator.detune);
        });
        lfoSelected.push({ target: target, LFO: LFO, gain: gain });
        break;

      case `osc2 coarse`:
        LFO = new Tone.LFO({
          min:
            -2400 +
            (currentValue ? currentValue : this.preset.osc2.transpose) * 100,
          max:
            2400 +
            (currentValue ? currentValue : this.preset.osc2.transpose) * 100,
          amplitude: 0.5,
          frequency: rate,
        })
          .chain(...this.voices.map((v) => v.oscillator2.detune))
          .start();
        lfoSelected.push({ target: target, LFO: LFO });
        break;

      case `osc1 fine`:
        gain = new Tone.Gain();
        LFO = new Tone.LFO({
          min: -100 + (currentValue ? currentValue : this.preset.osc1.detune),
          max: 100 + (currentValue ? currentValue : this.preset.osc1.detune),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        Tone.connect(LFO, gain);
        this.voices.forEach((v) => {
          gain.connect(v.oscillator.detune);
        });
        lfoSelected.push({ target: target, LFO: LFO, gain: gain });
        break;
      case `osc2 fine`:
        gain = new Tone.Gain();
        LFO = new Tone.LFO({
          min: -100 + (currentValue ? currentValue : this.preset.osc2.detune),
          max: 100 + (currentValue ? currentValue : this.preset.osc2.detune),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        Tone.connect(LFO, gain);
        this.voices.forEach((v) => {
          gain.connect(v.detune2);
        });
        lfoSelected.push({ target: target, LFO: LFO, gain: gain });
        break;
      case `osc1 pulse width`:
        gain = new Tone.Gain();
        LFO = new Tone.LFO({
          min: -1 + (currentValue ? currentValue : this.preset.osc1.pulseWidth),
          max: 1 + (currentValue ? currentValue : this.preset.osc1.pulseWidth),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        Tone.connect(LFO, gain);
        this.voices.forEach((v) => {
          if (v.oscillator.type === "pulse" && v.oscillator.width)
            gain.connect(v.oscillator.width);
        });
        lfoSelected.push({ target: target, LFO: LFO, gain: gain });
        break;
      case `osc2 pulse width`:
        gain = new Tone.Gain();
        LFO = new Tone.LFO({
          min: -1 + (currentValue ? currentValue : this.preset.osc2.pulseWidth),
          max: 1 + (currentValue ? currentValue : this.preset.osc2.pulseWidth),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        Tone.connect(LFO, gain);
        this.voices.forEach((v) => {
          if (v.oscillator2.type === "pulse" && v.oscillator2.width)
            gain.connect(v.oscillator2.width);
        });
        lfoSelected.push({ target: target, LFO: LFO, gain: gain });
        break;
      case `osc1 volume`:
        LFO = new Tone.LFO({
          min: -70 + (currentValue ? currentValue : this.preset.osc1.volume),
          max: 12 + (currentValue ? currentValue : this.preset.osc1.volume),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(v.oscillator.volume);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;
      case `osc2 volume`:
        LFO = new Tone.LFO({
          min: -70 + (currentValue ? currentValue : this.preset.osc2.volume),
          max: 12 + (currentValue ? currentValue : this.preset.osc2.volume),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(v.oscillator2.volume);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;
      case "filter cutoff":
        LFO = new Tone.LFO({
          min: this.preset.filter.frequency - 10000,
          max: this.preset.filter.frequency + 10000,
          amplitude: 0.5,
          frequency: rate,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(v.filter.frequency);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;

      case "noise volume":
        LFO = new Tone.LFO({
          min: -70 + (currentValue ? currentValue : this.preset.noise.volume),
          max: 12 + (currentValue ? currentValue : this.preset.noise.volume),
          amplitude: 0.5,
          frequency: rate,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(v.noise.volume);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;

      default:
        break;
    }
  }

  disconnectLFO(target: LFOTarget, lfo: 1 | 2) {
    let lfoSelected = lfo === 1 ? this.LFO1 : this.LFO2;
    lfoSelected.forEach((lfo) => {
      if (lfo.target === target) {
        lfo.LFO.stop();
        lfo.LFO.dispose();
        lfo.gain?.dispose();
        // this.voices.forEach((v) => {

        //   v.oscillator2.stop();
        // });
      }
    });
    const filteredLFOs = lfoSelected.filter((lfo) => lfo.target !== target);
    lfo === 1 ? (this.LFO1 = filteredLFOs) : (this.LFO2 = filteredLFOs);
  }
}
