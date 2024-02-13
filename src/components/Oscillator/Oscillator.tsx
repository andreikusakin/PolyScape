import React from "react";
import Knob from "../Knob/Knob";
import styles from "./Oscillator.module.css";

import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { LFOTarget } from "@/lib/types/types";
import { OscillatorWaveform } from "../OscillatorWaveform";

type OscillatorProps = {
  engine: CustomPolySynth | undefined;
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



const Oscillator: React.FC<OscillatorProps> = ({
  engine,
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
  LFO1Destinations,
  LFO2Destinations,
}) => {
  const updateWaveformType = (
    type: "sine" | "sawtooth" | "pulse" | "triangle"
  ) => {
    setOscillatorType(type);
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.type = type))
      : engine?.voices.forEach((v) => (v.oscillator2.type = type));

    if (type === "pulse") {
      name === "osc1"
        ? engine?.voices.forEach((v) => (v.oscillator.width.value = pulseWidth))
        : engine?.voices.forEach(
            (v) => (v.oscillator2.width.value = pulseWidth)
          );
    }
  };

  const updatePulseWidth = (value: number) => {
    setPulseWidth(value);
    if (name === "osc1") {
      engine?.LFO1.find((lfo) => lfo.target === "osc1 pulse width")?.LFO.set({
        min: -1 + value,
        max: 1 + value,
      });
      engine?.LFO2.find((lfo) => lfo.target === "osc1 pulse width")?.LFO.set({
        min: -1 + value,
        max: 1 + value,
      });
      engine?.voices.forEach((v) => (v.oscillator.width.value = value));
    } else {
      engine?.LFO1.find((lfo) => lfo.target === "osc2 pulse width")?.LFO.set({
        min: -1 + value,
        max: 1 + value,
      });
      engine?.LFO2.find((lfo) => lfo.target === "osc2 pulse width")?.LFO.set({
        min: -1 + value,
        max: 1 + value,
      });
      engine?.voices.forEach((v) => (v.oscillator2.width.value = value));
    }
  };

  const updateCoarse = (value: number) => {
    setCoarse(value);
    engine?.LFO1.find((lfo) => lfo.target === "osc1 coarse")?.LFO.set({
      min: -2400 + value * 100,
      max: 2400 + value * 100,
    });
    engine?.LFO2.find((lfo) => lfo.target === "osc1 coarse")?.LFO.set({
      min: -2400 + value * 100,
      max: 2400 + value * 100,
    });
    const coarseValue = value * 100 + detune;
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.detune.value = coarseValue))
      : engine?.voices.forEach(
          (v) => (v.oscillator2.detune.value = coarseValue)
        );
  };

  const updateFine = (value: number) => {
    setDetune(value);
    engine?.LFO1.find((lfo) => lfo.target === "osc1 fine")?.LFO.set({
      min: -100 + value,
      max: 100 + value,
    });
    engine?.LFO2.find((lfo) => lfo.target === "osc1 fine")?.LFO.set({
      min: -100 + value,
      max: 100 + value,
    });
    engine?.LFO1.find((lfo) => lfo.target === "osc2 fine")?.LFO.set({
      min: -100 + value,
      max: 100 + value,
    });
    engine?.LFO2.find((lfo) => lfo.target === "osc2 fine")?.LFO.set({
      min: -100 + value,
      max: 100 + value,
    });
    const fineValue = value + coarse * 100;
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.detune.value = fineValue))
      : engine?.voices.forEach((v) => (v.oscillator2.detune.value = fineValue));
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    engine?.LFO1.find((lfo) => lfo.target === "osc1 volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    });
    engine?.LFO2.find((lfo) => lfo.target === "osc1 volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    });
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.volume.value = value))
      : engine?.voices.forEach((v) => (v.oscillator2.volume.value = value));
  };
  return (
    <div className={styles.oscillator}>
      <div className={styles.oscname}>{name}</div>
      <div className={styles.container}>
        <ul className={styles.shapes}>
          <li
            onClick={() => updateWaveformType("sine")}
            className={oscType === "sine" ? styles.selected : ""}
          >
            sine
          </li>
          <li
            onClick={() => updateWaveformType("sawtooth")}
            className={oscType === "sawtooth" ? styles.selected : ""}
          >
            sawtooth
          </li>
          <li
            onClick={() => updateWaveformType("pulse")}
            className={oscType === "pulse" ? styles.selected : ""}
          >
            square
          </li>
          <li
            onClick={() => updateWaveformType("triangle")}
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
          exponent={1}
          label={"pulse width"}
          radius={24}
          minValue={-1}
          maxValue={1}
          currentValue={pulseWidth}
          step={0.01}
          onChange={updatePulseWidth}
          lfo={false}
          lfoPercent={100}
          startingPoint={"middle"}
          interactive={oscType === "pulse" ? true : false}
        />

        <Knob
          exponent={1}
          label={"coarse"}
          minValue={-24}
          maxValue={24}
          currentValue={coarse}
          step={1}
          onChange={updateCoarse}
          radius={24}
          lfo={false}
          startingPoint={"middle"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"fine"}
          minValue={-100}
          maxValue={100}
          currentValue={detune}
          step={1}
          onChange={updateFine}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"volume"}
          minValue={-70}
          maxValue={12}
          unit={"db"}
          currentValue={volume}
          step={0.5}
          onChange={updateVolume}
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
