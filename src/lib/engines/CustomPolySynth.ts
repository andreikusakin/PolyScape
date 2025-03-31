import * as Tone from "tone/build/esm/index";
import { WebMidi } from "webmidi";
// @ts-ignore
import AudioKeys from "audiokeys";
import { Preset, LFOTarget } from "../types/types";
import { CustomVoice } from "./CustomVoice";
import MidiManager from "./MidiManager"; 

//TODO

//https://github.com/Tonejs/Tone.js/wiki/Arpeggiator

type LFO = {
  target: LFOTarget;
  LFO: Tone.LFO;
  gain?: Tone.Gain;
};

export default class CustomPolySynth {
  lastVoiceUsedIndex: number = -1;
  notesPressed: number[] = [];
  isMidiSupported: boolean = false;
  midiInputIndex = 0;
  midiInputs;
  midiInput;
  osc1Fine: number;
  osc1Coarse: number;
  osc2Fine: number;
  osc2Coarse: number;
  hold: boolean;
  currentDetuneOsc1: number[] = [];
  currentDetuneOsc2: number[] = [];
  panSpread: number = 0;
  private voiceCount: number = 10;
  voices: CustomVoice[] = [];
  private activeVoices: Map<number, CustomVoice> = new Map();
  keyboard: AudioKeys;
  unison: boolean = false;
  LFO1: LFO[] = [];
  LFO2: LFO[] = [];
  private preset: Preset;
  readonly outputNode: Tone.Gain;

  constructor(preset: Preset) {
    this.preset = preset;
    this.outputNode = new Tone.Gain({ gain: 0.5 });
    this.initializeVoices(this.outputNode, preset);
    this.loadFilterPreset(preset);
    this.loadMiscParamsFromPreset(preset);
    this.loadLFOs(preset);
    this.setupKeyboard();
    // this.setupMidi();
    if (MidiManager.isMidiSupported && MidiManager.midiInputs.length > 0) {
      this.midiInputs = MidiManager.midiInputs;
      this.midiInput = MidiManager.midiInputs[this.midiInputIndex];
      this.midiListener(this.midiInput);
      this.isMidiSupported = true;
    } else {
      console.error("MIDI not supported or no devices detected");
      this.isMidiSupported = false;
    }
    this.osc1Fine = preset.osc1.detune;
    this.osc1Coarse = preset.osc1.transpose;
    this.osc2Fine = preset.osc2.detune;
    this.osc2Coarse = preset.osc2.transpose;
    this.unison = preset.unison;
    this.setDetune(preset.detune);
    this.hold = preset.hold;
  }

  private initializeVoices(node: Tone.ToneAudioNode, preset: Preset) {
    for (let i = 0; i < this.voiceCount; i++) {
      const voice = new CustomVoice();
      this.loadOsccillatorPreset(preset, voice);
      voice.connect(node);
      this.voices.push(voice);
      this.currentDetuneOsc1.push(voice.oscillator.detune.value);
      this.currentDetuneOsc2.push(voice.oscillator2.detune.value);
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
    voice.envelope.attack = preset.envelopeAmplitude.attack;
    voice.envelope.decay = preset.envelopeAmplitude.decay;
    voice.envelope.sustain = preset.envelopeAmplitude.sustain;
    voice.envelope.release = preset.envelopeAmplitude.release;
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

  private loadMiscParamsFromPreset(preset: Preset) {
    this.unison = preset.unison;
    this.panSpread = preset.panSpread;
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

  updateHold() {
    this.hold = !this.hold;
    this.voices.forEach((v) => {
      v.triggerRelease();
    });
  }

  updatetUnison() {
    this.unison = !this.unison;
    this.voices.forEach((v) => {
      v.triggerRelease();
    });
    this.outputNode.gain.value = this.unison ? 0.15 : 0.5;
  }

  private setupKeyboard() {
    this.keyboard = new AudioKeys({
      polyphony: this.voiceCount,
      rows: 1,
      priority: "last",
    });
    this.keyboard.down((key: any) => {
      const velocity = key.velocity / 127;
      this.triggerAttack(key.note, Tone.now(), velocity);
    });

    this.keyboard.up((key: any) => {
      this.triggerRelease(key.note);
    });
  }

  private setupMidi() {
    if (navigator.requestMIDIAccess) {
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "midi" as PermissionName, sysex: false } as any)
          .then((result) => {
            if (result.state === "granted") {
              console.log("MIDI permission granted");
              this.isMidiSupported = true;
            } else if (result.state === "prompt") {
              console.log("MIDI permission prompt (not yet granted)");
            } else {
              console.log("MIDI permission denied");
            }
          })
          .catch((err) => {
            console.error("Permissions query error", err);
          });
      } else {

        navigator.requestMIDIAccess({ sysex: false })
          .then((midiAccess) => {
            console.log("MIDI access granted", midiAccess);
            this.isMidiSupported = true;
          })
          .catch((error) => {
            console.error("MIDI access denied", error);
          });
      }
    } else {
      console.error("Web MIDI API is not supported in this browser.");
    }
    
    WebMidi.enable({
      callback: (err: Error | null) => {
        if (err) {
          console.error("WebMidi could not be enabled.", err);
        } else {
          console.log(WebMidi.inputs);
          
          if (WebMidi.inputs.length < 1) {
            console.log("No MIDI devices detected");
            return;
          }
          this.midiInputs = WebMidi.inputs;
          this.midiInput = WebMidi.inputs[this.midiInputIndex];
          this.midiListener(this.midiInput);
        }
      },
      sysex: false
    });
  }

  muteKeyboard() {
    this.keyboard.down(() => {});
    this.keyboard.up(() => {});
  }

  unMuteKeyboard() {
    this.keyboard.down((key: any) => {
      const velocity = key.velocity / 127;
      this.triggerAttack(key.note, Tone.now(), velocity);
    });

    this.keyboard.up((key: any) => {
      this.triggerRelease(key.note);
    });
  }

  setMidiInputByIndex(index: number) {
    this.midiInputIndex = index;
    // this.midiInput.destroy();
    this.midiInput = WebMidi.inputs[index];
    this.midiListener(this.midiInput);
    
  }

  midiListener(input: any) {
    input.addListener("noteon", "all", (e: any) => {
      // console.log(e);
      this.triggerAttack(e.note.number, Tone.now(), e.velocity);
    });
    input.addListener("noteoff", "all", (e: any) => {
      this.triggerRelease(e.note.number);
    });
  }

  getMidiInputs() {
    return WebMidi.inputs;
  }

  triggerAttack(note: number, time: Tone.Unit.Time, velocity: number) {
    this.notesPressed.push(note);
    const frequency = Tone.Frequency(note, "midi").toFrequency();
    if (this.unison) {
      this.voices.forEach((v) => {
        v.triggerAttack(frequency, time, velocity);
      });
    } else {
      let availableVoice = null;
      for (let i = 0; i < this.voices.length; i++) {

        const index = (this.lastVoiceUsedIndex + i + this.voices.length) % this.voices.length;
        const candidate = this.voices[index];
        const frequencyValue = Number(candidate.frequency.value);
        if (!this.activeVoices.has(frequencyValue)) {
          availableVoice = candidate;
          this.lastVoiceUsedIndex = index;
          break;
        }
      }
      if (!availableVoice) {
        availableVoice = this.voices[this.lastVoiceUsedIndex];
        availableVoice.triggerRelease();
      }
      this.activeVoices.set(frequency, availableVoice);
      availableVoice.triggerAttack(frequency, time, velocity);
    }
  }
  

  triggerRelease(note: number) {
    if (this.hold) return;
    this.notesPressed = this.notesPressed.filter((n) => n !== note);
    const frequency = Tone.Frequency(note, "midi").toFrequency();
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
          min:
            (currentValue ? currentValue : this.preset.filter.frequency) -
            15000,
          max:
            (currentValue ? currentValue : this.preset.filter.frequency) +
            15000,
          amplitude: 0.5,
          frequency: rate,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(v.filter.frequency);
        });
        lfoSelected.push({ target: target, LFO: LFO });
        break;

      case "filter resonance":
        LFO = new Tone.LFO({
          min: (currentValue ? currentValue : this.preset.filter.Q) - 15,
          max: (currentValue ? currentValue : this.preset.filter.Q) + 15,
          amplitude: 0.5,
          frequency: rate,
        }).start();
        this.voices.forEach((v) => {
          LFO.connect(v.filter.Q);
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

  setPanSpread(value: number) {
    this.panSpread = value;
    this.voices.forEach((v, i) => {
      v.pan.value = (value * (i % 2 === 0 ? -1 : 1) * Math.random()) / 100;
    });
  }

  setFine(value: number, osc: 1 | 2) {
    if (osc === 1) {
      this.voices.forEach((v, i) => {
        v.oscillator.detune.value =
          v.oscillator.detune.value - this.osc1Fine + value;
      });
      this.osc1Fine = value;
    } else {
      this.voices.forEach((v, i) => {
        v.oscillator2.detune.value =
          v.oscillator2.detune.value - this.osc2Fine + value;
      });
      this.osc2Fine = value;
    }
  }

  setCoarse(value: number, osc: 1 | 2) {
    if (osc === 1) {
      this.voices.forEach((v, i) => {
        v.oscillator.detune.value =
          v.oscillator.detune.value - this.osc1Coarse * 100 + value * 100;
      });
      this.osc1Coarse = value;
    } else {
      this.voices.forEach((v, i) => {
        v.oscillator2.detune.value =
          v.oscillator2.detune.value - this.osc2Coarse * 100 + value * 100;
      });
      this.osc2Coarse = value;
    }
  }

  setDetune(value: number) {
    this.voices.forEach((v, i) => {
      const coefficientOsc1 = i % 2 === 0 ? -1 : 1;
      const coefficientOsc2 = i % 2 === 0 ? 1 : -1;
      const randomValue = Math.random() * (value - value / 4 + 1) + value / 4;
      v.oscillator.detune.value =
        v.oscillator.detune.value -
        this.currentDetuneOsc1[i] +
        coefficientOsc1 * randomValue;
      v.oscillator2.detune.value =
        v.oscillator2.detune.value -
        this.currentDetuneOsc2[i] +
        coefficientOsc2 * randomValue;
      this.currentDetuneOsc1[i] = coefficientOsc1 * randomValue;
      this.currentDetuneOsc2[i] = coefficientOsc2 * randomValue;
    });
  }

  dispose() {
    this.voices.forEach((v) => {
      v.dispose();
    });
    this.outputNode.dispose();
    this.keyboard = null;
    this.LFO1.forEach((lfo) => {
      lfo.LFO.dispose();
      lfo.gain?.dispose();
    });
    this.LFO2.forEach((lfo) => {
      lfo.LFO.dispose();
      lfo.gain?.dispose();
    });
    if (this.isMidiSupported && this.midiInput) {
      this.midiInput.removeListener("noteon");
      this.midiInput.removeListener("noteoff");
    }
  }
}
