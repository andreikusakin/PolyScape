import { LFODestination, LFOTarget } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import styles from "./LFO.module.css";
import Knob from "../Knob/Knob";
import { OscillatorWaveform } from "../OscillatorWaveform";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { Slider } from "../Slider/Slider";

type LFOProps = {
  engine?: CustomPolySynth;
  name: string;
  type: "sine" | "triangle" | "sawtooth" | "square";
  setType: (type: "sine" | "triangle" | "sawtooth" | "square") => void;
  rate: Tone.Unit.Frequency | Tone.FrequencyClass | number | string;
  setRate: (rate: Tone.Unit.Frequency) => void;
  sync: boolean;
  setSync: (sync: boolean) => void;
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
  sync,
  setSync,
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

  const updateRate = (value: Tone.Unit.Frequency) => {
    setRate(value);
    name === "lfo1"
      ? engine?.LFO1.forEach((lfo) => (lfo.LFO.frequency.value = value))
      : engine?.LFO2.forEach((lfo) => (lfo.LFO.frequency.value = value));
  };

  const handleDoubleClick = (target: LFOTarget) => {
    if (name === "lfo1") {
      setDestinations([
        ...destinations.filter((d: LFODestination) => d.target !== target),
      ]);
      engine?.LFO1.forEach((lfo) => {
        if (lfo.target === target) {
          lfo.LFO.stop();
          lfo.LFO.disconnect();
        }
      });
      const filteredLFOs = engine?.LFO1.filter((lfo) => lfo.target !== target);
      if (engine) engine.LFO1 = filteredLFOs ?? [];
    } else {
      setDestinations([
        ...destinations.filter((d: LFODestination) => d.target !== target),
      ]);
      engine?.LFO2.forEach((lfo) => {
        if (lfo.target === target) {
          lfo.LFO.stop();
          lfo.LFO.disconnect();
        }
      });
      const filteredLFOs = engine?.LFO2.filter((lfo) => lfo.target !== target);
      if (engine) engine.LFO2 = filteredLFOs ?? [];
    }
  };

  const updateLFOAmount = (target: LFOTarget, amount: number) => {
    setDestinations([
      ...destinations.map((d: LFODestination) =>
        d.target === target ? { ...d, amount: amount } : d
      ),
    ]);
    name === "lfo1"
      ? engine?.LFO1.forEach((lfo) => {
          if (lfo.target === target) {
            lfo.LFO.amplitude.value = amount;
          }
        })
      : engine?.LFO2.forEach((lfo) => {
          if (lfo.target === target) {
            lfo.LFO.amplitude.value = amount;
          }
        });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div
        className={[
          styles.container,
          name === "lfo1" ? styles.borderLFO1 : styles.borderLFO2,
        ].join(" ")}
      >
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
            <Knob
              radius={24}
              label={"rate"}
              interactive={true}
              minValue={0}
              maxValue={200}
              step={0.01}
              currentValue={rate}
              onChange={updateRate}
              exponent={1}
              startingPoint={"beginning"}
              sync={sync}
              unit={sync ? "" : "Hz"}
            />
          </div>
        </div>
        <div>
          <div className={styles.waveform}>
            <div className={styles.waveformAnimation}>
              <OscillatorWaveform oscType={type} />
            </div>
          </div>
          <div
            onClick={() => {
              setSync(!sync);
              setRate(sync ? "4n" : 1);
            }}
            className={[
              styles.sync,
              sync
                ? name === "lfo1"
                  ? styles.sync_activeLFO1
                  : styles.sync_activeLFO2
                : "",
            ].join(" ")}
          >
            <label>sync</label>
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
              <Slider
                key={i}
                lfoName={name}
                target={d.target}
                value={d.amount}
                min={0}
                max={1}
                step={0.01}
                handleDoubleClick={handleDoubleClick}
                onChange={updateLFOAmount}
              />
            ))}
          </div>
          <p>destinations</p>
        </div>
      </div>
    </div>
  );
};
