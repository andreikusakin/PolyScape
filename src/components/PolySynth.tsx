"use-client";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone/build/esm/index";
import PolySynthEngine from "@/engines/PolySynthEngine";

type preset = {
  osc1: {
    type: "sawtooth" | "sine" | "square" | "triangle";
  };
  osc2: {
    type: "sawtooth" | "sine" | "square" | "triangle";
  };
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
};

const initPreset: preset = {
  osc1: {
    type: "square",
  },
  osc2: {
    type: "square",
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.01,
  },
};

const PolySynth = () => {
  const polySynthEngine = useRef<PolySynthEngine>();

  // waveforms
  const [oscillator1Type, setOscillator1Type] = useState(initPreset.osc1.type);
  const [oscillator2Type, setOscillator2Type] = useState(initPreset.osc2.type);

  // envelopes

  const [attack, setAttack] = useState(initPreset.envelope.attack);
  const [decay, setDecay] = useState(initPreset.envelope.decay);
  const [sustain, setSustain] = useState(initPreset.envelope.sustain);
  const [release, setRelease] = useState(initPreset.envelope.release);

  // iniiialize synth
  useEffect(() => {
    const filterNode = new Tone.Gain({
      gain: 1,
      units: "normalRange",
    }).toDestination();

    polySynthEngine.current = new PolySynthEngine(
      8,
      filterNode,
      initPreset.osc1.type,
      initPreset.osc2.type,
      {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release,
      }
    );
  }, []);

  // update oscilators types
  useEffect(() => {
    polySynthEngine.current?.setOsc1Type(oscillator1Type);
    console.log("osc1 type changed to: ", oscillator1Type);
  }, [oscillator1Type]);

  useEffect(() => {
    polySynthEngine.current?.setOsc2Type(oscillator2Type);
    console.log("osc2 type changed to: ", oscillator2Type);
  }, [oscillator2Type]);

  // update envelopes
  useEffect(() => {
    polySynthEngine.current?.setAttackEngine(attack);
    console.log("attack changed to: ", attack);
  }, [attack]);

  useEffect(() => {
    polySynthEngine.current?.setDecayEngine(decay);
    console.log("decay changed to: ", decay);
  }, [decay]);

  useEffect(() => {
    polySynthEngine.current?.setSustainEngine(sustain);
    console.log("sustain changed to: ", sustain);
  }, [sustain]);

  useEffect(() => {
    polySynthEngine.current?.setReleaseEngine(release);
    console.log("release changed to: ", release);
  }, [release]);

  return (
    <div>
      <button onClick={() => Tone.start()}>Start</button>
      <label>
        Sine OSC1
        <input
          type="checkbox"
          checked={oscillator1Type === "sine"}
          onChange={() => setOscillator1Type("sine")}
        />
      </label>
      <label>
        Square OSC1
        <input
          type="checkbox"
          checked={oscillator1Type === "square"}
          onChange={() => setOscillator1Type("square")}
        />
      </label>
      <label>
        Sine OSC2
        <input
          type="checkbox"
          checked={oscillator2Type === "sine"}
          onChange={() => setOscillator2Type("sine")}
        />
      </label>

      <label>
        Square OSC2
        <input
          type="checkbox"
          checked={oscillator2Type === "square"}
          onChange={() => setOscillator2Type("square")}
        />
      </label>
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
          step='0.01'
          defaultValue={release}
          onChange={(e) => setRelease(Number(e.target.value))}
        />
      </label>
    </div>
  );
};

export default PolySynth;
