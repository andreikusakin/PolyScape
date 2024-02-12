import { LFODestination, LFOTarget } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import styles from "./LFO.module.css";
import Knob from "../Knob/Knob";
import { OscillatorWaveform } from "../OscillatorWaveform";

type LFOProps = {
  name: string;
  type: "sine" | "triangle" | "sawtooth" | "square";
  setType: (type: "sine" | "triangle" | "sawtooth" | "square") => void;
  rate: Tone.Unit.Frequency;
  setRate: (rate: Tone.Unit.Frequency) => void;
  destinations: [];
  setDestinations: (destinations: LFOTarget[]) => void;
};

export const LFO = ({
  name,
  type,
  setType,
  rate,
  setRate,
  destinations,
  setDestinations,
}: LFOProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>
        <div>
          <ul className={styles.shapes}>
            <li
              onClick={() => setType("sine")}
              className={type === "sine" ? styles.selected : ""}
            >
              sine
            </li>
            <li
              onClick={() => setType("sawtooth")}
              className={type === "sawtooth" ? styles.selected : ""}
            >
              sawtooth
            </li>
            <li
              onClick={() => setType("square")}
              className={type === "square" ? styles.selected : ""}
            >
              square
            </li>
            <li
              onClick={() => setType("triangle")}
              className={type === "triangle" ? styles.selected : ""}
            >
              triangle
            </li>
          </ul>
          <div className={styles.rate}>
            <Knob radius={24} label={"rate"} interactive={true} />
          </div>
        </div>
        <div className={styles.waveform}>
          <div className={styles.waveformAnimation}>
            <OscillatorWaveform oscType={type} />
          </div>
        </div>
        <div className={styles.destinations}>
          <div className={styles.underlay}>
            <div className={styles.selector}><label>assign</label></div>
            <div className={styles.selector}><label>assign</label></div>
            <div className={styles.selector}><label>assign</label></div>
            <div className={styles.selector}><label>assign</label></div>
          </div>
          <div className={styles.targets}>
            {destinations.map((d, i) => (
              <div className={styles.slider} key={i}>
                <label className={styles.label}>{d.target}</label>
                <span className={styles.track}></span>
              </div>
            ))}
          </div>
          <p>destinations</p>
        </div>
      </div>
    </div>
  );
};
