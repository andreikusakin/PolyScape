import React from "react";
import Knob from "../Knob/Knob";
import styles from "./Oscillator.module.css";

type OscillatorProps = {
  name: string;
  oscType: "sine" | "sawtooth" | "pulse" | "triangle";
  setOscillatorType: (
    oscType: "sine" | "sawtooth" | "pulse" | "triangle"
  ) => void;
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
        <div className={styles.row}>
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
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M1 22L0.999999 0M11 22L11 0M21 22L21 0M0 1H12M10 21H22"
                stroke="#86FFD3"
                stroke-width="2"
              />
            </svg>
          </div>
          <Knob
            name={"pulse width"}
            radius={24}
            percent={45}
            lfo={1}
            startingPoint={"middle"}
            interactive={false}
          />
        </div>
        <div className={styles.row}>
          <Knob
            name={"coarse"}
            radius={24}
            percent={45}
            lfo={1}
            startingPoint={"middle"}
            interactive={true}
          />
          <Knob
            name={"detune"}
            radius={24}
            percent={45}
            lfo={1}
            startingPoint={"middle"}
            interactive={true}
          />
          <Knob
            name={"volume"}
            radius={24}
            percent={45}
            lfo={1}
            startingPoint={"middle"}
            interactive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Oscillator;
