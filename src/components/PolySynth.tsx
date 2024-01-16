"use-client";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone/build/esm/index";
import PolySynthEngine from "@/engines/PolySynthEngine";

type preset = {
  osc1: {
    oscillator: {
      type: "sawtooth" | "sine" | "square" | "triangle";
    };
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
  };
  osc2: {
    oscillator: {
      type: "sawtooth" | "sine" | "square" | "triangle";
    };
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
  };
};

const initPreset: preset = {
  osc1: {
    oscillator: {
      type: "square",
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 1,
      release: 0.1,
    },
  },
  osc2: {
    oscillator: {
      type: "square",
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 1,
      release: 0.1,
    },
  },
};

const PolySynth = () => {
  const polySynthEngine = useRef<PolySynthEngine>();
  const [oscillator1Type, setOscillator1Type] = useState(
    initPreset.osc1.oscillator.type
  );
  const [oscillator2Type, setOscillator2Type] = useState(
    initPreset.osc2.oscillator.type
  );

  useEffect(() => {
    const filterNode = new Tone.Gain({
      gain: 1,
      units: "normalRange",
    }).toDestination();

    polySynthEngine.current = new PolySynthEngine(
      8,
      filterNode,
      initPreset.osc1.oscillator.type,
      initPreset.osc2.oscillator.type
    );

    // polySynthEngine.current?.setOsc1Type("sine");
    // polySynthEngine.current?.setOsc2Type("sine");
  }, []);

  useEffect(() => {
    polySynthEngine.current?.setOsc1Type(oscillator1Type);
    console.log("osc1 type changed to: ", oscillator1Type);
  }, [oscillator1Type]);

  useEffect(() => {
    polySynthEngine.current?.setOsc2Type(oscillator2Type);
    console.log("osc2 type changed to: ", oscillator2Type);
  }, [oscillator2Type]);
  console.log(polySynthEngine);
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
    </div>
  );
};

export default PolySynth;
