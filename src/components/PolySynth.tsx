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
  filter: {
    type: "lowpass" | "highpass" | "bandpass" | "notch";
    frequency: number;
    rolloff: Tone.FilterRollOff;
    Q: number;
  };
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
  filter: { type: "lowpass", frequency: 0, rolloff: -12, Q: 0 },
  filterEnvelope: {
    attack: 0,
    decay: 0.01,
    sustain: 0,
    release: 0,
    baseFrequency: 15000,
    octaves: 0,
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
  const [filterType, setFilterType] = useState<
    "lowpass" | "highpass" | "bandpass" | "notch"
  >();
  const [filterFrequency, setFilterFrequency] = useState<number>();
  const [filterRolloff, setFilterRolloff] = useState<Tone.FilterRollOff>();
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
    // setFilterEnvelopeOctaves(preset.filterEnvelope.octaves);
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

  // update filter

  useEffect(() => {
    if (filterType) {
      polySynthEngine.current?.setFilterTypeEngine(filterType);
      console.log("filter type changed to: ", filterType);
    }
  }, [filterType]);

  useEffect(() => {
    if (filterFrequency) {
      polySynthEngine.current?.setFilterFrequencyEngine(filterFrequency);
      console.log("filter frequency changed to: ", filterFrequency);
    }
  }, [filterFrequency]);

  useEffect(() => {
    if (filterRolloff) {
      polySynthEngine.current?.setFilterRollOffEngine(filterRolloff);
      console.log("filter rolloff changed to: ", filterRolloff);
    }
  }, [filterRolloff]);

  useEffect(() => {
    if (filterQ) {
      polySynthEngine.current?.setFilterQEngine(filterQ);
      console.log("filter Q changed to: ", filterQ);
    }
  }, [filterQ]);

  // update filter envelope

  useEffect(() => {
    if (filterEnvelopeAttack) {
      polySynthEngine.current?.setFilterEnvelopeAttackEngine(
        filterEnvelopeAttack
      );
      console.log("filter envelope attack changed to: ", filterEnvelopeAttack);
    }
  }, [filterEnvelopeAttack]);

  useEffect(() => {
    if (filterEnvelopeDecay) {
      polySynthEngine.current?.setFilterEnvelopeDecayEngine(
        filterEnvelopeDecay
      );
      console.log("filter envelope decay changed to: ", filterEnvelopeDecay);
    }
  }, [filterEnvelopeDecay]);

  useEffect(() => {
    if (filterEnvelopeSustain) {
      polySynthEngine.current?.setFilterEnvelopeSustainEngine(
        filterEnvelopeSustain
      );
      console.log(
        "filter envelope sustain changed to: ",
        filterEnvelopeSustain
      );
    }
  }, [filterEnvelopeSustain]);

  useEffect(() => {
    if (filterEnvelopeRelease) {
      polySynthEngine.current?.setFilterEnvelopeReleaseEngine(
        filterEnvelopeRelease
      );
      console.log(
        "filter envelope release changed to: ",
        filterEnvelopeRelease
      );
    }
  }, [filterEnvelopeRelease]);

  useEffect(() => {
    if (filterEnvelopeBaseFrequency) {
      polySynthEngine.current?.setFilterEnvelopeFrequencyEngine(
        filterEnvelopeBaseFrequency
      );
      console.log(
        "filter envelope base frequency changed to: ",
        filterEnvelopeBaseFrequency
      );
    }
  }, [filterEnvelopeBaseFrequency]);

  useEffect(() => {
    if (filterEnvelopeExponent) {
      polySynthEngine.current?.setFilterEnvelopeExponentEngine(
        filterEnvelopeExponent
      );
      console.log(
        "filter envelope exponent changed to: ",
        filterEnvelopeExponent
      );
    }
  }, [filterEnvelopeExponent]);

  useEffect(() => {
    if (filterEnvelopeOctaves) {
      polySynthEngine.current?.setFilterEnvelopeOctavesEngine(
        filterEnvelopeOctaves
      );
      console.log(
        "filter envelope octaves changed to: ",
        filterEnvelopeOctaves
      );
    }
  }, [filterEnvelopeOctaves]);

  // update fx

  useEffect(() => {
    if (panSpread) {
      polySynthEngine.current?.setPanSpreadEngine(panSpread);
      console.log("panSpread changed to: ", panSpread);
    }
  }, [panSpread]);

  return (
    <div className="flex w-full h-full gap-10">
      <button onClick={() => Tone.start()}>Start</button>
      <div className="flex flex-col gap-10">
        <div className="flex gap-5 flex-col">
          OSC1
          <div className="flex gap-5">
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
          </div>
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
        <div className="flex gap-5 flex-col">
          OSC2
          <div className="flex gap-5">
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
          </div>
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
      </div>
      <div className="flex gap-5 flex-col">
        FILTER
        <div className="flex gap-5">
          <label>
            Lowpass
            <input
              type="checkbox"
              checked={filterType === "lowpass"}
              onChange={() => setFilterType("lowpass")}
            />
          </label>
          <label>
            Highpass
            <input
              type="checkbox"
              checked={filterType === "highpass"}
              onChange={() => setFilterType("highpass")}
            />
          </label>
          <label>
            Bandpass
            <input
              type="checkbox"
              checked={filterType === "bandpass"}
              onChange={() => setFilterType("bandpass")}
            />
          </label>
          <label>
            Notch
            <input
              type="checkbox"
              checked={filterType === "notch"}
              onChange={() => setFilterType("notch")}
            />
          </label>
        </div>
        <label>
          Frequency
          <input
            type="range"
            min="0"
            max="15000"
            step="1"
            defaultValue={filterFrequency}
            onChange={(e) => setFilterFrequency(Number(e.target.value))}
          />
        </label>
        <div className="flex gap-5">
          Rolloff
          <label>
            12
            <input
              type="checkbox"
              checked={filterRolloff === -12}
              onChange={() => setFilterRolloff(-12)}
            />
          </label>
          <label>
            24
            <input
              type="checkbox"
              checked={filterRolloff === -24}
              onChange={() => setFilterRolloff(-24)}
            />
          </label>
          <label>
            48
            <input
              type="checkbox"
              checked={filterRolloff === -48}
              onChange={() => setFilterRolloff(-48)}
            />
          </label>
        </div>
        <label>
          Q
          <input
            type="range"
            min="0"
            max="15"
            step="0.1"
            defaultValue={filterQ}
            onChange={(e) => setFilterQ(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="flex gap-5 flex-col">
        <div className="flex gap-5 flex-col">
          AMPLITUDE ENVELOPE
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
        <div className="flex gap-5 flex-col">
          FILTER ENVELOPE
          <label>
            Attack
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              defaultValue={filterEnvelopeAttack}
              onChange={(e) => setFilterEnvelopeAttack(Number(e.target.value))}
            />
          </label>
          <label>
            Decay
            <input
              type="range"
              min="0.01"
              max="100"
              step="0.01"
              defaultValue={filterEnvelopeDecay}
              onChange={(e) => setFilterEnvelopeDecay(Number(e.target.value))}
            />
          </label>
          <label>
            Sustain
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={filterEnvelopeSustain}
              onChange={(e) => setFilterEnvelopeSustain(Number(e.target.value))}
            />
          </label>
          <label>
            Release
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              defaultValue={filterEnvelopeRelease}
              onChange={(e) => setFilterEnvelopeRelease(Number(e.target.value))}
            />
          </label>
          <label>
            Base Frequency
            <input
              type="range"
              min="0"
              max="15000"
              step="1"
              defaultValue={filterEnvelopeBaseFrequency}
              onChange={(e) =>
                setFilterEnvelopeBaseFrequency(Number(e.target.value))
              }
            />
          </label>
          <label>
            Exponent
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              defaultValue={filterEnvelopeExponent}
              onChange={(e) =>
                setFilterEnvelopeExponent(Number(e.target.value))
              }
            />
          </label>
          <label>
            Octaves
            <input
              type="range"
              min="0"
              max="7"
              step="0.01"
              defaultValue={filterEnvelopeOctaves}
              onChange={(e) => setFilterEnvelopeOctaves(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-5 flex-col">
        FX
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
