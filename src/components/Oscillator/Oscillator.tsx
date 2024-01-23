import React from "react";
import Knob from "../Knob/Knob";
import styles from "./Oscillator.module.css";
import { Sawtooth, Sine, Square, Triangle } from "./Shapes";

type OscillatorProps = {
  name: string;
  oscType: "sine" | "sawtooth" | "pulse" | "triangle";
  setOscillatorType: (
    oscType: "sine" | "sawtooth" | "pulse" | "triangle"
  ) => void;
  coarse: number;
  setCoarse: (coarse: number) => void;
  detune: number;
  setDetune: (detune: number) => void;
  pulseWidth: number;
  setPulseWidth: (pulseWidth: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
};

const OscillatorWaveform = ({
  oscType,
}: {
  oscType: "sine" | "sawtooth" | "pulse" | "triangle";
}) => {
  switch (oscType) {
    case "sine":
      return <Sine />;
    case "sawtooth":
      return <Sawtooth />;
    case "pulse":
      return <Square />;
    case "triangle":
      return <Triangle />;
    default:
      return null;
  }
};

const Oscillator: React.FC<OscillatorProps> = ({
  name,
  oscType,
  setOscillatorType,
  coarse,
  setCoarse,
  detune,
  setDetune,
  pulseWidth,
  setPulseWidth,
  volume,
  setVolume,
}) => {
  return (
    <div className={styles.oscillator}>
      <div className={styles.oscname}>{name}</div>
      <div className={styles.container}>
        <ul className={styles.shapes}>
          <li
            onClick={() => setOscillatorType("sine")}
            className={oscType === "sine" ? styles.selected : ""}
          >
            sine
          </li>
          <li
            onClick={() => setOscillatorType("sawtooth")}
            className={oscType === "sawtooth" ? styles.selected : ""}
          >
            sawtooth
          </li>
          <li
            onClick={() => setOscillatorType("pulse")}
            className={oscType === "pulse" ? styles.selected : ""}
          >
            square
          </li>
          <li
            onClick={() => setOscillatorType("triangle")}
            className={oscType === "triangle" ? styles.selected : ""}
          >
            triangle
          </li>
        </ul>

        <div className={styles.waveform}>
          <div className={styles.waveformAnimation}>
            <OscillatorWaveform oscType={oscType} />
          </div>
        </div>
        <Knob
          label={"pulse width"}
          radius={24}
          minValue={-1}
          maxValue={1}
          currentValue={pulseWidth}
          step={0.01}
          updateValue={setPulseWidth}
          lfo={false}
          lfoPercent={100}
          startingPoint={"middle"}
          interactive={oscType === "pulse" ? true : false}
        />

        <Knob
          label={"coarse"}
          minValue={-24}
          maxValue={24}
          currentValue={coarse}
          step={1}
          updateValue={setCoarse}
          radius={24}
          lfo={false}
          startingPoint={"middle"}
          interactive={true}
        />
        <Knob
          label={"detune"}
          minValue={0}
          maxValue={100}
          currentValue={detune}
          step={1}
          updateValue={setDetune}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"volume"}
          minValue={-96}
          maxValue={6}
          currentValue={volume}
          step={0.5}
          updateValue={setVolume}
          radius={24}
          lfo={false}
          startingPoint={"middle"}
          interactive={true}
        />
      </div>
    </div>
  );
};

export default Oscillator;
