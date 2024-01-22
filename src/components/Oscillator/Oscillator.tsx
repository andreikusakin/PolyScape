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
};

const OscillatorWaveform = ({ oscType }: { oscType: "sine" | "sawtooth" | "pulse" | "triangle" }) => {
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
          <OscillatorWaveform oscType={oscType} />
        </div>
        <Knob
          label={"pulse width"}
          radius={24}
          percent={50}
          lfo={1}
          lfoPercent={100}
          startingPoint={"middle"}
          interactive={oscType === "pulse" ? true : false}
        />

        <Knob
          label={"coarse"}
          radius={24}
          percent={45}
          lfo={1}
          startingPoint={"middle"}
          interactive={true}
        />
        <Knob
          label={"detune"}
          radius={24}
          percent={45}
          lfo={1}
          startingPoint={"middle"}
          interactive={true}
        />
        <Knob
          label={"volume"}
          radius={24}
          percent={45}
          lfo={1}
          startingPoint={"middle"}
          interactive={true}
        />
      </div>
    </div>
  );
};

export default Oscillator;
