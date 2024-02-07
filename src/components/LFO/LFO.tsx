import { LFODestination, LFOTarget } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import styles from "./LFO.module.css";
import Knob from "../Knob/Knob";

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
          <Knob />
        </div>
        <div className={styles.destinations}>
          <div className={styles.underlay}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {destinations.map((d, i) => (
            <div className={styles.destination} key={i}>
              <label className={styles.label}>{d.target}</label>
              <input
                className={styles.slider}
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={0}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
