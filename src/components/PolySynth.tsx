"use-client";
import { useState, useEffect, useRef, use } from "react";
import * as Tone from "tone/build/esm/index";
import PolySynthEngine from "@/engines/PolySynthEngine";
import { init } from "next/dist/compiled/webpack/webpack";

type Preset = {
  osc1: {
    type: "sawtooth" | "sine" | "square" | "triangle";
    detune: number;
    transpose: number;
  };
  osc2: {
    type: "sawtooth" | "sine" | "square" | "triangle";
    detune: number;
    transpose: number;
  };
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  filter: { type: string; frequency: number; rolloff: number; Q: number };
  filterEnvelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    baseFrequency: number;
    octaves: number;
    exponent: number;
  };
  unison: boolean;
  panSpread: number;
};

const initPreset: Preset = {
  osc1: {
    type: "sine",
    detune: 0,
    transpose: 0,
  },
  osc2: {
    type: "sine",
    detune: 0,
    transpose: 0,
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.01,
  },
  filter: { type: "lowpass", frequency: 20000, rolloff: -12, Q: 0 },
  filterEnvelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.01,
    baseFrequency: 20000,
    octaves: 4,
    exponent: 0,
  },
  unison: false,
  panSpread: 0,
};

const PolySynth = () => {
  const polySynthEngine = useRef<PolySynthEngine>();

  // OSC1
  const [oscillator1Type, setOscillator1Type] = useState<
    "sawtooth" | "sine" | "square" | "triangle"
  >();
  const [osc1Detune, setOsc1Detune] = useState<number>();
  const [osc1Transpose, setOsc1Transpose] = useState<number>();

  // OSC2
  const [oscillator2Type, setOscillator2Type] = useState<
    "sawtooth" | "sine" | "square" | "triangle"
  >();
  const [osc2Detune, setOsc2Detune] = useState<number>();
  const [osc2Transpose, setOsc2Transpose] = useState<number>();

  // envelope amplitude
  const [attack, setAttack] = useState<number>();
  const [decay, setDecay] = useState<number>();
  const [sustain, setSustain] = useState<number>();
  const [release, setRelease] = useState<number>();

  // filter
  const [filterType, setFilterType] = useState<string>();
  const [filterFrequency, setFilterFrequency] = useState<number>();
  const [filterRolloff, setFilterRolloff] = useState<number>();
  const [filterQ, setFilterQ] = useState<number>();

  const [filterEnvelopeAttack, setFilterEnvelopeAttack] = useState<number>();
  const [filterEnvelopeDecay, setFilterEnvelopeDecay] = useState<number>();
  const [filterEnvelopeSustain, setFilterEnvelopeSustain] = useState<number>();
  const [filterEnvelopeRelease, setFilterEnvelopeRelease] = useState<number>();
  const [filterEnvelopeBaseFrequency, setFilterEnvelopeBaseFrequency] =
    useState<number>();
  const [filterEnvelopeOctaves, setFilterEnvelopeOctaves] = useState<number>();
  const [filterEnvelopeExponent, setFilterEnvelopeExponent] =
    useState<number>();

  // fx
  const [panSpread, setPanSpread] = useState<number>();

  function loadPreset(preset: Preset) {
    setOscillator1Type(preset.osc1.type);
    setOsc1Detune(preset.osc1.detune);
    setOsc1Transpose(preset.osc1.transpose);

    setOscillator2Type(preset.osc2.type);
    setOsc2Detune(preset.osc2.detune);
    setOsc2Transpose(preset.osc2.transpose);

    setAttack(preset.envelope.attack);
    setDecay(preset.envelope.decay);
    setSustain(preset.envelope.sustain);
    setRelease(preset.envelope.release);

    setFilterType(preset.filter.type);
    setFilterFrequency(preset.filter.frequency);
    setFilterRolloff(preset.filter.rolloff);
    setFilterQ(preset.filter.Q);

    setFilterEnvelopeAttack(preset.filterEnvelope.attack);
    setFilterEnvelopeDecay(preset.filterEnvelope.decay);
    setFilterEnvelopeSustain(preset.filterEnvelope.sustain);
    setFilterEnvelopeRelease(preset.filterEnvelope.release);
    setFilterEnvelopeBaseFrequency(preset.filterEnvelope.baseFrequency);
    setFilterEnvelopeOctaves(preset.filterEnvelope.octaves);
    setFilterEnvelopeExponent(preset.filterEnvelope.exponent);

    setPanSpread(preset.panSpread);
  }

  // initialize synth
  useEffect(() => {
    const filterNode = new Tone.Gain({
      gain: 0.06,
      units: "normalRange",
    }).toDestination();

    polySynthEngine.current = new PolySynthEngine(filterNode);

    loadPreset(initPreset);
  }, []);

  // update oscilators types
  useEffect(() => {
    if (oscillator1Type) {
      polySynthEngine.current?.setOsc1TypeEngine(oscillator1Type);
      console.log("osc1 type changed to: ", oscillator1Type);
    }
  }, [oscillator1Type]);

  useEffect(() => {
    if (oscillator2Type) {
      polySynthEngine.current?.setOsc2TypeEngine(oscillator2Type);
      console.log("osc2 type changed to: ", oscillator2Type);
    }
  }, [oscillator2Type]);

  // update detune

  useEffect(() => {
    if (osc1Detune) {
      polySynthEngine.current?.setOsc1DetuneEngine(osc1Detune);
      console.log("osc1 detune changed to: ", osc1Detune);
    }
  }, [osc1Detune]);

  useEffect(() => {
    if (osc2Detune) {
      polySynthEngine.current?.setOsc2DetuneEngine(osc2Detune);
      console.log("osc2 detune changed to: ", osc2Detune);
    }
  }, [osc2Detune]);

  // update transpose

  useEffect(() => {
    if (osc1Transpose) {
      polySynthEngine.current?.setOsc1TransposeEngine(osc1Transpose);
      console.log("osc1 transpose changed to: ", osc1Transpose);
    }
  }, [osc1Transpose]);

  useEffect(() => {
    if (osc2Transpose) {
      polySynthEngine.current?.setOsc2TransposeEngine(osc2Transpose);
      console.log("osc2 transpose changed to: ", osc2Transpose);
    }
  }, [osc2Transpose]);

  // update envelopes
  useEffect(() => {
    if (attack) {
      polySynthEngine.current?.setAttackEngine(attack);
      console.log("attack changed to: ", attack);
    }
  }, [attack]);

  useEffect(() => {
    if (decay) {
      polySynthEngine.current?.setDecayEngine(decay);
      console.log("decay changed to: ", decay);
    }
  }, [decay]);

  useEffect(() => {
    if (sustain) {
      polySynthEngine.current?.setSustainEngine(sustain);
      console.log("sustain changed to: ", sustain);
    }
  }, [sustain]);

  useEffect(() => {
    if (release) {
      polySynthEngine.current?.setReleaseEngine(release);
      console.log("release changed to: ", release);
    }
  }, [release]);

  // update fx

  useEffect(() => {
    if (panSpread) {
      polySynthEngine.current?.setPanSpreadEngine(panSpread);
      console.log("panSpread changed to: ", panSpread);
    }
  }, [panSpread]);

  return (
    <div>
      <button onClick={() => Tone.start()}>Start</button>
      <div>
        OSC1
        <label>
          Sine
          <input
            type="checkbox"
            checked={oscillator1Type === "sine"}
            onChange={() => setOscillator1Type("sine")}
          />
        </label>
        <label>
          Sawtooth
          <input
            type="checkbox"
            checked={oscillator1Type === "sawtooth"}
            onChange={() => setOscillator1Type("sawtooth")}
          />
        </label>
        <label>
          Square
          <input
            type="checkbox"
            checked={oscillator1Type === "square"}
            onChange={() => setOscillator1Type("square")}
          />
        </label>
        <label>
          Triangle
          <input
            type="checkbox"
            checked={oscillator1Type === "triangle"}
            onChange={() => setOscillator1Type("triangle")}
          />
        </label>
        <label>
          Detune
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            defaultValue={osc1Detune}
            onChange={(e) => {
              setOsc1Detune(Number(e.target.value));
            }}
          />
        </label>
        <label>
          Transpose
          <input
            type="range"
            min="-24"
            max="24"
            step="1"
            defaultValue={osc1Transpose}
            onChange={(e) => {
              setOsc1Transpose(Number(e.target.value));
            }}
          />
        </label>
      </div>
      <div>
        OSC2
        <label>
          Sine
          <input
            type="checkbox"
            checked={oscillator2Type === "sine"}
            onChange={() => setOscillator2Type("sine")}
          />
        </label>
        <label>
          Sawtooth
          <input
            type="checkbox"
            checked={oscillator2Type === "sawtooth"}
            onChange={() => setOscillator2Type("sawtooth")}
          />
        </label>
        <label>
          Square
          <input
            type="checkbox"
            checked={oscillator2Type === "square"}
            onChange={() => setOscillator2Type("square")}
          />
        </label>
        <label>
          Triangle
          <input
            type="checkbox"
            checked={oscillator2Type === "triangle"}
            onChange={() => setOscillator2Type("triangle")}
          />
        </label>
        <label>
          Detune
          <input
            type="range"
            min="0"
            max="99"
            step="1"
            defaultValue={osc2Detune}
            onChange={(e) => {
              setOsc2Detune(Number(e.target.value));
            }}
          />
        </label>
        <label>
          Transpose
          <input
            type="range"
            min="-24"
            max="24"
            step="1"
            defaultValue={osc2Transpose}
            onChange={(e) => {
              setOsc2Transpose(Number(e.target.value));
            }}
          />
        </label>
      </div>
      <div>
        <label>
          Attack
          <input
            type="range"
            min="0.01"
            max="10"
            step="0.01"
            defaultValue={attack}
            onChange={(e) => setAttack(Number(e.target.value))}
          />
        </label>
        <label>
          Decay
          <input
            type="range"
            min="0.01"
            max="10"
            step="0.01"
            defaultValue={decay}
            onChange={(e) => setDecay(Number(e.target.value))}
          />
        </label>
        <label>
          Sustain
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={sustain}
            onChange={(e) => setSustain(Number(e.target.value))}
          />
        </label>
        <label>
          Release
          <input
            type="range"
            min="0.01"
            max="10"
            step="0.01"
            defaultValue={release}
            onChange={(e) => setRelease(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Pan Spread
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            defaultValue={panSpread}
            onChange={(e) => setPanSpread(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default PolySynth;
