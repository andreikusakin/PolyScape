import * as Tone from "tone/build/esm/index";
import {
  VariableOscillator,
  VariableOscilatorOptions,
} from "./VariableOscilator";
import { Monophonic } from "tone/build/esm/instrument/Monophonic";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import { on } from "events";

export interface CustomVoiceOptions extends Tone.MonoSynthOptions {
  oscillator2: Tone.OmniOscillatorOptions;
  noise: Tone.NoiseOptions;
  panner: { pan: Tone.Unit.AudioRange };
}

export class CustomVoice extends Monophonic<CustomVoiceOptions> {
  name = "CustomVoice";
  oscillator: Tone.OmniOscillator<any>;
  oscillator2: Tone.OmniOscillator<any>;
  noise: Tone.Noise;
  panner: Tone.Panner;
  frequency: Tone.Signal<"frequency">;
  detune: Tone.Signal<"cents">;
  frequency2: Tone.Signal<"frequency">;
  detune2: Tone.Signal<"cents">;
  envelope: Tone.AmplitudeEnvelope;
  filter: Tone.Filter;
  filterEnvelope: Tone.FrequencyEnvelope;

  constructor(options?: RecursivePartial<CustomVoiceOptions>);
  constructor() {
    super();
    this.oscillator = new Tone.OmniOscillator();
    this.oscillator2 = new Tone.OmniOscillator();
    this.noise = new Tone.Noise();
    this.panner = new Tone.Panner();
    this.frequency = this.oscillator.frequency;
    this.detune = this.oscillator.detune;
    this.frequency2 = this.oscillator2.frequency;
    this.detune2 = this.oscillator2.detune;
    this.filter = new Tone.Filter();
    this.filterEnvelope = new Tone.FrequencyEnvelope();
    this.envelope = new Tone.AmplitudeEnvelope();
    this.oscillator.chain(this.panner, this.filter, this.envelope, this.output);
    this.oscillator2.chain(
      this.panner,
      this.filter,
      this.envelope,
      this.output
    );
    this.noise.chain(this.panner, this.filter, this.envelope, this.output);
    this.filterEnvelope.connect(this.filter.frequency);
    console.log(this.oscillator2.frequency.value);
  }

  protected _triggerEnvelopeAttack(
    time: Tone.Unit.Seconds,
    velocity: number
  ): void {
    this.envelope.triggerAttack(time, velocity);
    this.filterEnvelope.triggerAttack(time);
    this.oscillator.start(time);
    this.oscillator2.start(time);
    this.noise.start(time);

    if (this.envelope.sustain === 0) {
      const computedAttack = this.toSeconds(this.envelope.attack);
      const computedDecay = this.toSeconds(this.envelope.decay);
      this.oscillator.stop(time + computedAttack + computedDecay);
      this.oscillator2.stop(time + computedAttack + computedDecay);
      this.noise.stop(time + computedAttack + computedDecay);
    }
  }

  protected _triggerEnvelopeRelease(time: Tone.Unit.Seconds): void {
    this.envelope.triggerRelease();
    this.filterEnvelope.triggerRelease();
    this.oscillator.stop(time + this.toSeconds(this.envelope.release));
    this.oscillator2.stop(time + this.toSeconds(this.envelope.release));
    this.noise.stop(time + this.toSeconds(this.envelope.release));
  }

  getLevelAtTime(time: Tone.Unit.Time): Tone.Unit.NormalRange {
    time = this.toSeconds(time);
    return this.envelope.getValueAtTime(time);
  }

  triggerAttack(
    note: Tone.Unit.Frequency | Tone.FrequencyClass,
    time?: Tone.Unit.Time,
    velocity: Tone.Unit.NormalRange = 1
  ): this {
    this.log("triggerAttack", note, time, velocity);
    const seconds = this.toSeconds(time);
    this._triggerEnvelopeAttack(seconds, velocity);
    this.setNote(note, seconds);
    return this;
  }

  triggerRelease(time?: Tone.Unit.Time): this {
    this.log("triggerRelease", time);
    const seconds = this.toSeconds(time);
    this._triggerEnvelopeRelease(seconds);
    return this;
  }

  setNote(
    note: Tone.Unit.Frequency | Tone.FrequencyClass,
    time?: Tone.Unit.Time
  ): this {
    const computedTime = this.toSeconds(time);
    const computedFrequency =
      note instanceof Tone.FrequencyClass ? note.toFrequency() : note;
    if (this.portamento > 0 && this.getLevelAtTime(computedTime) > 0.05) {
      const portTime = this.toSeconds(this.portamento);
      this.frequency.exponentialRampTo(
        computedFrequency,
        portTime,
        computedTime
      );
      this.frequency2.exponentialRampTo(
        computedFrequency,
        portTime,
        computedTime
      );
    } else {
      this.frequency.setValueAtTime(computedFrequency, computedTime);
      this.frequency2.setValueAtTime(computedFrequency, computedTime);
    }
    return this;
  }

  dispose(): this {
    super.dispose();
    this.oscillator.dispose();
    this.oscillator2?.dispose();
    this.noise.dispose();
    this.envelope.dispose();
    this.filter.dispose();
    this.filterEnvelope.dispose();
    this.panner.dispose();
    return this;
  }
}
