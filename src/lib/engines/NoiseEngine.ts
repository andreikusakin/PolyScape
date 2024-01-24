import * as Tone from "tone/build/esm/index";

type NoiseOptions = {
  type: "white" | "pink" | "brown";
  volume: number;
};

type EnvelopeOptions = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type FilterOptions = {
  type: "lowpass" | "highpass" | "bandpass" | "notch";
  frequency: number;
  rolloff: Tone.FilterRollOff;
  Q: number;
};

type FilterEnvelopeOptions = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  baseFrequency: number;
  octaves: number;
  exponent: number;
};

type NoiseEngineOptions = {
  noise: NoiseOptions;
  envelope: EnvelopeOptions;
  filter: FilterOptions;
  filterEnvelope: FilterEnvelopeOptions;
};

export default class NoiseEngine {
  public noise: Tone.Noise;
  public envelope: Tone.AmplitudeEnvelope;
  public filter: Tone.Filter;
  public filterEnvelope: Tone.FrequencyEnvelope;

  constructor(options: NoiseEngineOptions) {
    this.noise = new Tone.Noise().start();
    this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
    this.filter = new Tone.Filter(options.filter);
    this.filterEnvelope = new Tone.FrequencyEnvelope(options.filterEnvelope);
    this.noise.connect(this.envelope);
    this.envelope.connect(this.filter);
    this.filterEnvelope.connect(this.filter.frequency);
  }

  start() {
    this.noise.start();
  }

  stop() {
    this.noise.stop();
  }

  triggerAttack(time: Tone.Unit.Time, velocity: Tone.Unit.NormalRange) {
    this.envelope.triggerAttack(time, velocity);
    this.filterEnvelope.triggerAttack(time, velocity);
  }

  triggerRelease() {
    this.envelope.triggerRelease();
    this.filterEnvelope.triggerRelease();
  }

  connect(destination: Tone.InputNode) {
    this.filter.connect(destination);
  }
}
