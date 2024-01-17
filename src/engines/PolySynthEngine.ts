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

//combine methods for both oscs

//mimick detune and panspread

//mixer mimick

class PolySynthEngine {
  private voiceCount: number = 8;
  private voices: [Tone.MonoSynth, Tone.MonoSynth][];
  private panners: Tone.Panner[];
  private activeVoices: Map<number, number>;
  private lastPlayedVoice: number = 0;
  private keyboard: AudioKeys;
  private unison: boolean = false;
  // private phaseLFO: Tone.LFO;

  private currentDetuneOSC1Values: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  private currentDetuneOSC2Values: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  private maxDetuneOSC1: number[] = [31, -49, 49, -45, 24, -40, 42, -32];
  private maxDetuneOSC2: number[] = [-41, 38, -25, 49, 15, -49, 18, 39];

  constructor(node: Tone.Gain<"decibels" | "gain" | "normalRange">) {
    this.voices = [];
    this.panners = [];
    this.activeVoices = new Map();

    this.unison;
    // this.phaseLFO = new Tone.LFO({
    //   type: "sine",
    //   min: -0.1,
    //   max: 0.1,
    //   frequency: 0.3,
    // });

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
            exponent: 1,
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
            exponent: 1,
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

  private triggerAttackEngine(frequency: number, time, velocity: number) {
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

  setOsc1TypeEngine(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.voices.forEach(([osc1, osc2]) =>
      osc1.set({ oscillator: { type: waveform } })
    );
  }

  setOsc2TypeEngine(waveform: "sawtooth" | "sine" | "square" | "triangle") {
    this.voices.forEach(([osc1, osc2]) =>
      osc2.set({ oscillator: { type: waveform } })
    );
  }

  //Set Detune

  setOsc1DetuneEngine(detune: number, osc: number) {
    for (let i = 0; i < this.voiceCount; i++) {
      const maxDetune = this.maxDetuneOSC1[i];
      const currentDetune = this.voices[i][0].detune.value;
      const step = Math.round(currentDetune / 100);
      const detuneAmount = maxDetune * (detune / 100);
      this.currentDetuneOSC1Values[i] = detuneAmount;
      this.voices[i][0].detune.value = detuneAmount + step * 100;
      console.log(this.voices[i][0].detune.value + " detuned value OSC1");
    }
  }

  setOsc2DetuneEngine(detune: number) {
    for (let i = 0; i < this.voiceCount; i++) {
      const maxDetune = this.maxDetuneOSC2[i];
      const currentDetune = this.voices[i][1].detune.value;
      const step = Math.round(currentDetune / 100);
      const detuneAmount = maxDetune * (detune / 100);
      this.currentDetuneOSC2Values[i] = detuneAmount;
      this.voices[i][1].detune.value = detuneAmount + step * 100;
      console.log(this.voices[i][1].detune.value + " detuned value OSC2");
    }
  }

  //Set Transpose

  setOsc1TransposeEngine(transpose: number) {
    for (let i = 0; i < this.voices.length; i++) {
      // const currentDetune = this.voices[i][0].detune.value % 100;
      // console.log("CURRENT DETUNE " + currentDetune);
      const transposedValue = transpose * 100 + this.currentDetuneOSC1Values[i];
      this.voices[i][0].detune.value = transposedValue;
      // console.log(
      //   "OSC1 transposed by " + transpose + " semitones"
      // );
    }
  }

  setOsc2TransposeEngine(transpose: number ) {
    for (let i = 0; i < this.voices.length; i++) {
      const currentDetune = this.voices[i].detune.value;
      const detune = currentDetune % 100;
      console.log("CURRENT DETUNE " + currentDetune);
      const transposedValue = transpose * 100 + detune;
      this.voices[i].detune.value = transposedValue;
      console.log(this.voices[i].detune.value + " transposed");
    }
  }

  //Set Pan Spread

  setPanSpreadEngine(panSpread: number) {
    for (let i = 0; i < this.voiceCount; i++) {
      const randomNumber = (Math.random() * 2 - 1) * (panSpread / 100);

      // this.OSC1Panners[i].pan.linearRampTo(randomNumber1, 0.01);
      // this.OSC2Panners[i].pan.linearRampTo(randomNumber2, 0.01);

      this.panners[i].pan.linearRampTo(randomNumber, 0.01);
    }
  }

  //Set Envelope Amplitude

  setAttackEngine(newAttack: number) {
    this.voices.forEach((v) => v.set({ envelope: { attack: newAttack } }));
    this.voices.forEach((v) => v.set({ envelope: { attack: newAttack } }));
  }

  setDecayEngine(newDecay: number) {
    this.voices.forEach((v) => v.set({ envelope: { decay: newDecay } }));
    this.voices.forEach((v) => v.set({ envelope: { decay: newDecay } }));
  }

  setSustainEngine(newSustain: number) {
    this.voices.forEach((v) => v.set({ envelope: { sustain: newSustain } }));
    this.voices.forEach((v) => v.set({ envelope: { sustain: newSustain } }));
  }

  setReleaseEngine(newRelease: number) {
    this.voices.forEach((v) => v.set({ envelope: { release: newRelease } }));
    this.voices.forEach((v) => v.set({ envelope: { release: newRelease } }));
  }

  //Set Filter

  setFilterTypeEngine(
    filterType: "lowpass" | "highpass" | "bandpass" | "notch"
  ) {
    this.voices.forEach((v) => v.set({ filter: { type: filterType } }));
    this.voices.forEach((v) => v.set({ filter: { type: filterType } }));
  }

  setFilterFrequencyEngine(newFrequency: number) {
    this.voices.forEach((v) => v.set({ filter: { frequency: newFrequency } }));
    console.log(newFrequency);
    this.voices.forEach((v) => v.set({ filter: { frequency: newFrequency } }));
  }

  setFilterQEngine(newQ: number) {
    this.voices.forEach((v) => v.set({ filter: { Q: newQ } }));
    this.voices.forEach((v) => v.set({ filter: { Q: newQ } }));
  }

  setFilterRollOffEngine(newRollOff: Tone.FilterRollOff) {
    this.voices.forEach((v) => v.set({ filter: { rolloff: newRollOff } }));
    this.voices.forEach((v) => v.set({ filter: { rolloff: newRollOff } }));
  }

  //Set Envelope Filter

  setFilterEnvelopeAttackEngine(newAttack: number) {
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { attack: newAttack } })
    );
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { attack: newAttack } })
    );
  }

  setFilterEnvelopeDecayEngine(newDecay: number) {
    this.voices.forEach((v) => v.set({ filterEnvelope: { decay: newDecay } }));
    this.voices.forEach((v) => v.set({ filterEnvelope: { decay: newDecay } }));
  }

  setFilterEnvelopeSustainEngine(newSustain: number) {
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { sustain: newSustain } })
    );
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { sustain: newSustain } })
    );
  }

  setFilterEnvelopeReleaseEngine(newRelease: number) {
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { release: newRelease } })
    );
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { release: newRelease } })
    );
  }

  setFilterEnvelopeFrequencyEngine(newFrequency: number) {
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { baseFrequency: newFrequency } })
    );
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { baseFrequency: newFrequency } })
    );
  }

  setFilterEnvelopeExponentEngine(newExponent: number) {
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { exponent: newExponent } })
    );
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { exponent: newExponent } })
    );
  }

  setFilterEnvelopeOctavesEngine(newOctaves: number) {
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { octaves: newOctaves } })
    );
    this.voices.forEach((v) =>
      v.set({ filterEnvelope: { octaves: newOctaves } })
    );
  }
}

export default PolySynthEngine;
