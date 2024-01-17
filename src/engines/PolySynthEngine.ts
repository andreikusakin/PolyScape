import * as Tone from "tone/build/esm/index";
// @ts-ignore
import AudioKeys from "audiokeys";

//TODO

// transpose for each oscillator
// filters for each voices
// Tone.Channel as mixer
// unison
// portamento
// pulse width
// make IRs for reverb
// noise
// midi and midi mapping

//mimick detune and panspread

class PolySynthEngine {
  private voiceCount: number = 8;
  private OSC1Voices: Tone.MonoSynth[];
  private OSC2Voices: Tone.MonoSynth[];
  private activeVoicesOSC1: Map<Tone.MonoSynth, number>;
  private activeVoicesOSC2: Map<Tone.MonoSynth, number>;
  private OSC1Transpose: number = 0;
  private OSC2Transpose: number = 0;
  private OSC1Panners: Tone.Panner[];
  private OSC2Panners: Tone.Panner[];;
  private keyboard: AudioKeys;
  private unison: boolean = false;
  private phaseLFO: Tone.LFO;
  private lastPlayedVoiceOSC1: number = 0;
private lastPlayedVoiceOSC2: number = 0;

  constructor(node: Tone.Gain<"decibels" | "gain" | "normalRange">) {
    this.OSC1Voices = [];
    this.OSC2Voices = [];
    this.OSC1Panners = [];
    this.OSC2Panners = [];
    this.OSC1Transpose;
    this.OSC2Transpose;
    this.activeVoicesOSC1 = new Map();
    this.activeVoicesOSC2 = new Map();
    this.unison;
    this.phaseLFO = new Tone.LFO({
      type: "sine",
      min: -0.1,
      max: 0.1,
      frequency: 0.3,
    });

    for (let i = 0; i < this.voiceCount; i++) {
      this.OSC1Panners.push(new Tone.Panner().connect(node));
      this.OSC1Voices.push(
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
            exponent: 1,
          },
        }).connect(this.OSC1Panners[i])
      );
      this.OSC2Panners.push(new Tone.Panner().connect(node));
      this.OSC2Voices.push(
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
            exponent: 1,
          },
          detune: 0,
        }).connect(this.OSC2Panners[i])
      );
    }
    this.phaseLFO.start();
    this.OSC2Voices.forEach((v) => {
      this.phaseLFO.connect(v.detune);
      this.phaseLFO.connect(v.volume);
    });

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

  private triggerAttackEngine(frequency: number, time, velocity: number) {
    if (this.unison) {
      this.OSC1Voices.forEach(v => v.triggerAttack(frequency, time, velocity));
      this.OSC2Voices.forEach(v => v.triggerAttack(frequency, time, velocity));
    } else {
      const nextVoiceIndexOSC1 = (this.lastPlayedVoiceOSC1 + 1) % this.OSC1Voices.length;
      const OSC1Voice = this.OSC1Voices[nextVoiceIndexOSC1];
      OSC1Voice.triggerAttack(frequency, time, velocity);
      this.activeVoicesOSC1.set(OSC1Voice, frequency);
      this.lastPlayedVoiceOSC1 = nextVoiceIndexOSC1;
  
      const nextVoiceIndexOSC2 = (this.lastPlayedVoiceOSC2 + 1) % this.OSC2Voices.length;
      const OSC2Voice = this.OSC2Voices[nextVoiceIndexOSC2];
      OSC2Voice.triggerAttack(frequency, time, velocity);
      this.activeVoicesOSC2.set(OSC2Voice, frequency);
      this.lastPlayedVoiceOSC2 = nextVoiceIndexOSC2;
    }
  }
  

  private triggerReleaseEngine(frequency: number) {
    if (this.unison) {
      this.OSC1Voices.forEach((v) => v.triggerRelease());
      this.OSC2Voices.forEach((v) => v.triggerRelease());
    } else {
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
  }

  //Set Waveforms

  setOsc1TypeEngine(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.OSC1Voices.forEach((v: Tone.MonoSynth) =>
      v.set({ oscillator: { type: waveform } })
    );
  }

  setOsc2TypeEngine(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.OSC2Voices.forEach((v) => v.set({ oscillator: { type: waveform } }));
  }

  //Set Detune

  setOsc1DetuneEngine(detune: number) {
    for (let i = 0; i < this.OSC1Voices.length; i++) {
      const currentDetune = this.OSC1Voices[i].detune.value;
      const step = Math.round(currentDetune / 100);

      const detunedValue =
        Math.floor(((Math.random() * 60 - 30) * detune) / 100) + step * 100;
      this.OSC1Voices[i].detune.value = detunedValue;
      console.log(this.OSC1Voices[i].detune.value + " detuned value OSC1");
    }
  }

  setOsc2DetuneEngine(detune: number) {
    for (let i = 0; i < this.OSC2Voices.length; i++) {
      const currentDetune = this.OSC2Voices[i].detune.value;
      const step = Math.round(currentDetune / 100);
      const detunedValue =
        Math.floor(((Math.random() * 60 - 30) * detune) / 100) + step * 100;
      this.OSC2Voices[i].detune.value = detunedValue;
      console.log(this.OSC1Voices[i].detune.value + " detuned value OSC2");
    }
  }

  //Set Transpose

  setOsc1TransposeEngine(transpose: number) {
    for (let i = 0; i < this.OSC1Voices.length; i++) {
      const currentDetune = this.OSC1Voices[i].detune.value;
      const detune = currentDetune % 100;
      console.log("CURRENT DETUNE " + currentDetune);
      const transposedValue = transpose * 100 + detune;
      this.OSC1Voices[i].detune.value = transposedValue;
      console.log(this.OSC1Voices[i].detune.value + " transposed");
    }
  }

  setOsc2TransposeEngine(transpose: number) {
    for (let i = 0; i < this.OSC2Voices.length; i++) {
      const currentDetune = this.OSC2Voices[i].detune.value;
      const detune = currentDetune % 100;
      console.log("CURRENT DETUNE " + currentDetune);
      const transposedValue = transpose * 100 + detune;
      this.OSC2Voices[i].detune.value = transposedValue;
      console.log(this.OSC2Voices[i].detune.value + " transposed");
    }
  }

  //Set Pan Spread

  setPanSpreadEngine(panSpread: number) {
    for (let i = 0; i < this.OSC1Panners.length; i++) {
      const randomNumber1 = (Math.random() * 2 - 1) * (panSpread / 100);
      const randomNumber2 = (Math.random() * 2 - 1) * (panSpread / 100);
      console.log(randomNumber1);
      this.OSC1Panners[i].pan.linearRampTo(randomNumber1, 0.01);
      this.OSC2Panners[i].pan.linearRampTo(randomNumber2, 0.01);
    }
  }

  //Set Envelope Amplitude

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

  //Set Filter

  setFilterTypeEngine(
    filterType: "lowpass" | "highpass" | "bandpass" | "notch"
  ) {
    this.OSC1Voices.forEach((v) => v.set({ filter: { type: filterType } }));
    this.OSC2Voices.forEach((v) => v.set({ filter: { type: filterType } }));
  }

  setFilterFrequencyEngine(newFrequency: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filter: { frequency: newFrequency } })
    );
    console.log(newFrequency);
    this.OSC2Voices.forEach((v) =>
      v.set({ filter: { frequency: newFrequency } })
    );
  }

  setFilterQEngine(newQ: number) {
    this.OSC1Voices.forEach((v) => v.set({ filter: { Q: newQ } }));
    this.OSC2Voices.forEach((v) => v.set({ filter: { Q: newQ } }));
  }

  setFilterRollOffEngine(newRollOff: Tone.FilterRollOff) {
    this.OSC1Voices.forEach((v) => v.set({ filter: { rolloff: newRollOff } }));
    this.OSC2Voices.forEach((v) => v.set({ filter: { rolloff: newRollOff } }));
  }

  //Set Envelope Filter

  setFilterEnvelopeAttackEngine(newAttack: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { attack: newAttack } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { attack: newAttack } })
    );
  }

  setFilterEnvelopeDecayEngine(newDecay: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { decay: newDecay } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { decay: newDecay } })
    );
  }

  setFilterEnvelopeSustainEngine(newSustain: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { sustain: newSustain } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { sustain: newSustain } })
    );
  }

  setFilterEnvelopeReleaseEngine(newRelease: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { release: newRelease } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { release: newRelease } })
    );
  }

  setFilterEnvelopeFrequencyEngine(newFrequency: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { baseFrequency: newFrequency } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { baseFrequency: newFrequency } })
    );
  }

  setFilterEnvelopeExponentEngine(newExponent: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { exponent: newExponent } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { exponent: newExponent } })
    );
  }

  setFilterEnvelopeOctavesEngine(newOctaves: number) {
    this.OSC1Voices.forEach((v) =>
      v.set({ filterEnvelope: { octaves: newOctaves } })
    );
    this.OSC2Voices.forEach((v) =>
      v.set({ filterEnvelope: { octaves: newOctaves } })
    );
  }
}

export default PolySynthEngine;
