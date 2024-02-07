import * as Tone from "tone/build/esm/index";

interface WaveTable {
  real: Float32Array;
  imag: Float32Array;
}

export interface VariableOscilatorOptions extends Tone.ToneOscillatorNodeOptions { 
  morph: number;
  dutyCycle: number;
}


export class VariableOscillator extends Tone.ToneOscillatorNode {
  private periodicWaveSize: number = this.context.sampleRate / 4;
  dutyCycle: number = 0.5;
  private sineCoeffs = this.createSine();
  private triangleCoeffs = this.createTriangle();
  private sawtoothCoeffs = this.createSawtooth();
  private pulseCoeffs = this.createPulse(this.dutyCycle);

  morph: number = 0;

  constructor(options?: Partial<VariableOscilatorOptions>)
  constructor() {
    super();
    this.morph = 0;
    this.setWaveform(this.morph); // Set the initial waveform to sine
  }

  // Creates sine coefficients for a periodic wave
  private createSine() {
    let real = new Float32Array(this.periodicWaveSize + 1);
    let imag = new Float32Array(this.periodicWaveSize + 1);
    imag[1] = 1;
    return { real, imag };
  }

  // Creates triangle coefficients for a periodic wave
  private createTriangle() {
    let real = new Float32Array(this.periodicWaveSize + 1);
    let imag = new Float32Array(this.periodicWaveSize + 1);
    for (let i = 1; i <= this.periodicWaveSize; i += 2) {
      imag[i] = (8 * Math.sin((i * Math.PI) / 2)) / Math.pow(i * Math.PI, 2);
    }
    return { real, imag };
  }

  // Creates sawtooth coefficients for a periodic wave
  private createSawtooth() {
    let real = new Float32Array(this.periodicWaveSize + 1);
    let imag = new Float32Array(this.periodicWaveSize + 1);
    for (let i = 1; i <= this.periodicWaveSize; i++) {
      imag[i] = Math.pow(-1, i + 1) * (2 / (i * Math.PI));
    }
    return { real, imag };
  }

  // Creates pulse coefficients for a periodic wave
  private createPulse(dutyCycle: number) {
    let real = new Float32Array(this.periodicWaveSize + 1);
    let imag = new Float32Array(this.periodicWaveSize + 1);

    for (let i = 1; i <= this.periodicWaveSize; i++) {
      real[i] = (2 * Math.sin(i * dutyCycle * Math.PI)) / (i * Math.PI);
    }
    return { real, imag };
  }

  private morphCoeffs(
    value: number,
    waveTable1: WaveTable,
    waveTable2: WaveTable
  ) {
    let morphedCoeffs = {
      real: new Float32Array(this.periodicWaveSize + 1),
      imag: new Float32Array(this.periodicWaveSize + 1),
    };
    for (let i = 0; i <= this.periodicWaveSize; i++) {
      morphedCoeffs.real[i] =
        (1 - value) * waveTable1.real[i] + value * waveTable2.real[i];
      morphedCoeffs.imag[i] =
        (1 - value) * waveTable1.imag[i] + value * waveTable2.imag[i];
    }
    return morphedCoeffs;
  }

  setMorph(value: number) {
    this.morph = value;
    this.setWaveform(value);
  }

  setDutyCycle(value: number) {
    this.dutyCycle = value;
    console.log("Duty Cycle: ", this.dutyCycle);
    this.pulseCoeffs = this.createPulse(this.dutyCycle);
    this.setWaveform(this.morph);
  }

  setWaveform(value: number) {
    let coeffs;
    if (value <= 1) {
      // Sine to Triangle
      coeffs = this.morphCoeffs(value, this.sineCoeffs, this.triangleCoeffs);
    } else if (value <= 2) {
      // Triangle to Sawtooth
      coeffs = this.morphCoeffs(
        value - 1,
        this.triangleCoeffs,
        this.sawtoothCoeffs
      );
    } else {
      // Sawtooth to Pulse(square)
      coeffs = this.morphCoeffs(
        value - 2,
        this.sawtoothCoeffs,
        this.pulseCoeffs
      );
    }

    const wave = this.context.createPeriodicWave(coeffs.real, coeffs.imag);

    this.setPeriodicWave(wave);
  }

//   start(time?: Tone.Unit.Time) {
//     const computedTime = this.toSeconds(time);
//     this.log("start", computedTime);
//     this._startGain(computedTime);
//     this._oscillator.start(computedTime);
//     return this;
//   }

//   stop(time?: Tone.Unit.Time) {
//     const computedTime = this.toSeconds(time);
//     if (this.state === 'started') {
//         console.log('stop', computedTime);
//         this._stopSource(computedTime);
//     }

//     return this;
// }

}
