import React from "react";
import Knob from "../Knob/Knob";
import styles from "./Oscillator.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { LFOTarget, Preset } from "@/lib/types/types";
import { OscillatorWaveform } from "../OscillatorWaveform";

type OscillatorProps = {
  engine: CustomPolySynth | undefined;
  name: string;
  settings: Preset["osc1"] | Preset["osc2"];
  updateSettings: (settings: Preset["osc1"] | Preset["osc2"]) => void;
  isSelectingLFO: false | 1 | 2;
  assignLFO: (target: LFOTarget, lfo: 1 | 2) => void;
};

const Oscillator: React.FC<OscillatorProps> = ({
  engine,
  name,
  settings,
  updateSettings,
  isSelectingLFO,
  assignLFO,
}) => {
  const updateWaveformType = (
    type: "sine" | "sawtooth" | "pulse" | "triangle"
  ) => {
    updateSettings({ ...settings, type: type });
    if (name === "osc1") {
      engine?.voices.forEach((v) => (v.oscillator.type = type));
      engine?.disconnectLFO("osc1 pulse width", 1);
    } else {
      engine?.voices.forEach((v) => (v.oscillator2.type = type));
    }

    if (type === "pulse") {
      name === "osc1"
        ? engine?.voices.forEach((v) => (v.oscillator.width.value = settings.pulseWidth))
        : engine?.voices.forEach(
            (v) => (v.oscillator2.width.value = settings.pulseWidth)
          );
    }
  };

  const updatePulseWidth = (value: number) => {
    updateSettings({ ...settings, pulseWidth: value });
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.width.value = value))
      : engine?.voices.forEach((v) => (v.oscillator2.width.value = value));
  };

  const updateCoarse = (value: number) => {
    updateSettings({ ...settings, transpose: value });
    const coarseValue = value * 100 + settings.detune;

    name === "osc1"
      ? engine?.voices.forEach((v) => v.oscillator.set({ detune: coarseValue }))
      : engine?.voices.forEach(
          (v) => (v.oscillator2.detune.value = coarseValue)
        );
  };

  const updateFine = (value: number) => {
    updateSettings({ ...settings, detune: value });
    const fineValue = value + settings.transpose * 100;
    name === "osc1"
      ? engine?.voices.forEach((v) => (v.oscillator.detune.value = fineValue))
      : engine?.voices.forEach((v) => (v.oscillator2.detune.value = fineValue));
  };

  const updateVolume = (value: number) => {
    updateSettings({ ...settings, volume: value });
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
            className={settings.type === "sine" ? styles.selected : ""}
          >
            sine
          </li>
          <li
            onClick={() => updateWaveformType("sawtooth")}
            className={settings.type === "sawtooth" ? styles.selected : ""}
          >
            sawtooth
          </li>
          <li
            onClick={() => updateWaveformType("pulse")}
            className={settings.type === "pulse" ? styles.selected : ""}
          >
            square
          </li>
          <li
            onClick={() => updateWaveformType("triangle")}
            className={settings.type === "triangle" ? styles.selected : ""}
          >
            triangle
          </li>
        </ul>

        <div className={styles.waveform}>
          <div className={styles.waveformAnimation}>
            <OscillatorWaveform oscType={settings.type} />
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
          currentValue={settings.pulseWidth}
          step={0.01}
          onChange={updatePulseWidth}
          isSelectingLFO={isSelectingLFO}
          // lfoPercent={100}
          startingPoint={"middle"}
          interactive={settings.type === "pulse" ? true : false}
          assignLFO={assignLFO}
        />

        <Knob
          exponent={1}
          label={"coarse"}
          lfoParameter={name === "osc1" ? "osc1 coarse" : "osc2 coarse"}
          minValue={-24}
          maxValue={24}
          currentValue={settings.transpose}
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
          currentValue={settings.detune}
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
          currentValue={settings.volume}
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
