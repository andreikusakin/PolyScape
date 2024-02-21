import React from "react";
import Knob from "../Knob/Knob";
import styles from "./Oscillator.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
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
  lfo1: [];
  lfo2: [];
  isSelectingLFO: false | 1 | 2;
  assignLFO: (target: LFOTarget, lfo: 1 | 2) => void;
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
  isSelectingLFO,
  assignLFO,
  lfo1,
  lfo2,
}) => {
  const updateWaveformType = (
    type: "sine" | "sawtooth" | "pulse" | "triangle"
  ) => {
    setOscillatorType(type);
    if (name === "osc1") {
      engine?.voices.forEach((v) => (v.oscillator.type = type));
      engine?.disconnectLFO("osc1 pulse width", 1);
    } else {
      engine?.voices.forEach((v) => (v.oscillator2.type = type));
    }

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
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.width.value = value))
      : engine?.voices.forEach((v) => (v.oscillator2.width.value = value));
  };

  const updateCoarse = (value: number) => {
    setCoarse(value);
    const coarseValue = value * 100 + detune;

    name === "osc1"
      ? engine?.voices.forEach((v) => v.oscillator.set({ detune: coarseValue }))
      : engine?.voices.forEach(
          (v) => (v.oscillator2.detune.value = coarseValue)
        );
  };

  const updateFine = (value: number) => {
    setDetune(value);
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
    engine?.LFO1.find((lfo) => lfo.target === "osc2 volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    });
    engine?.LFO2.find((lfo) => lfo.target === "osc2 volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    });
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.volume.value = value))
      : engine?.voices.forEach((v) => (v.oscillator2.volume.value = value));
  };
  return (
    <SectionWrapper name={name}>
      <div className={styles.grid}>
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
          lfoParameter={
            name === "osc1" ? "osc1 pulse width" : "osc2 pulse width"
          }
          radius={24}
          minValue={-1}
          maxValue={1}
          currentValue={pulseWidth}
          step={0.01}
          onChange={updatePulseWidth}
          isSelectingLFO={isSelectingLFO}
          // lfoPercent={100}
          startingPoint={"middle"}
          interactive={oscType === "pulse" ? true : false}
          assignLFO={assignLFO}
        />

        <Knob
          exponent={1}
          label={"coarse"}
          lfoParameter={name === "osc1" ? "osc1 coarse" : "osc2 coarse"}
          minValue={-24}
          maxValue={24}
          currentValue={coarse}
          step={1}
          onChange={updateCoarse}
          radius={24}
          isSelectingLFO={isSelectingLFO}
          startingPoint={"middle"}
          interactive={true}
          assignLFO={assignLFO}
          // lfoAmount={lfo1?.find((lfo) => lfo.target === "osc1 coarse")?.amount}
        />
        <Knob
          exponent={1}
          label={"fine"}
          lfoParameter={name === "osc1" ? "osc1 fine" : "osc2 fine"}
          minValue={-100}
          maxValue={100}
          currentValue={detune}
          step={1}
          onChange={updateFine}
          radius={24}
          isSelectingLFO={isSelectingLFO}
          startingPoint={"beginning"}
          interactive={true}
          assignLFO={assignLFO}
        />
        <Knob
          exponent={1}
          label={"volume"}
          lfoParameter={name === "osc1" ? "osc1 volume" : "osc2 volume"}
          minValue={-70}
          maxValue={12}
          unit={"db"}
          currentValue={volume}
          step={0.5}
          onChange={updateVolume}
          radius={24}
          isSelectingLFO={isSelectingLFO}
          startingPoint={"middle"}
          interactive={true}
          assignLFO={assignLFO}
        />
      </div>
    </SectionWrapper>
  );
};

export default Oscillator;
