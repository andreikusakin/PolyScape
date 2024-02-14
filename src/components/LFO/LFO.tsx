import { LFODestination, LFOTarget } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import styles from "./LFO.module.css";
import Knob from "../Knob/Knob";
import { OscillatorWaveform } from "../OscillatorWaveform";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";

type LFOProps = {
  engine?: CustomPolySynth;
  name: string;
  type: "sine" | "triangle" | "sawtooth" | "square";
  setType: (type: "sine" | "triangle" | "sawtooth" | "square") => void;
  rate: Tone.Unit.Frequency;
  setRate: (rate: Tone.Unit.Frequency) => void;
  destinations: [];
  setDestinations: ([]) => void;
  isSelecting: false | 1 | 2;
  setIsSelecting: (lfo: false | 1 | 2) => void;
};

export const LFO = ({
  engine,
  name,
  type,
  setType,
  rate,
  setRate,
  destinations,
  setDestinations,
  isSelecting,
  setIsSelecting,
}: LFOProps) => {
  const handleAssignClick = () => {
    setIsSelecting(name === "lfo1" ? 1 : 2);
  };

  const updateWaveformType = (
    type: "sine" | "sawtooth" | "square" | "triangle"
  ) => {
    setType(type);
    name === "lfo1"
      ? engine?.LFO1.forEach((lfo) => (lfo.LFO.type = type))
      : engine?.LFO2.forEach((lfo) => (lfo.LFO.type = type));
  };

  const handleDoubleClick = (target: LFOTarget) => {
    if (name === "lfo1") {
      setDestinations([...destinations.filter((d: LFODestination) => d.target !== target)]);
      engine?.LFO1.forEach(lfo => {
        if (lfo.target === target) {
          lfo.LFO.stop();
          lfo.LFO.disconnect();
        }});
    const filteredLFOs = engine?.LFO1.filter(lfo => lfo.target !== target);
    if (engine)
    engine.LFO1 = filteredLFOs ?? [];
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>
        <div>
          <ul className={styles.shapes}>
            <li
              onClick={() => updateWaveformType("sine")}
              className={type === "sine" ? styles.selected : ""}
            >
              sine
            </li>
            <li
              onClick={() => updateWaveformType("sawtooth")}
              className={type === "sawtooth" ? styles.selected : ""}
            >
              sawtooth
            </li>
            <li
              onClick={() => updateWaveformType("square")}
              className={type === "square" ? styles.selected : ""}
            >
              square
            </li>
            <li
              onClick={() => updateWaveformType("triangle")}
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
            <div className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </div>
            <div className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </div>
            <div className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </div>
            <div className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </div>
          </div>
          <div className={styles.targets}>
            {destinations.map((d, i) => (
              <div className={styles.slider} key={i} onDoubleClick={() => handleDoubleClick(d.target)}>
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
