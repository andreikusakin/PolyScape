import React from "react";
import Knob from "../Knob/Knob";
import styles from "./Oscillator.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { OscillatorWaveform } from "../OscillatorWaveform";
import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type OscillatorProps = {
  oscNumber: 1 | 2;
};

const Oscillator = ({ oscNumber }: OscillatorProps) => {
  console.log("RERENDER OSCILLATOR");
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const { settings, updateSettings } = useSynthSettingsStore(
    useShallow((state) => ({
      settings: oscNumber === 1 ? state.osc1 : state.osc2,
      updateSettings:
        oscNumber === 1 ? state.setOsc1Params : state.setOsc2Params,
    }))
  );
  const updateWaveformType = (
    type: "sine" | "sawtooth" | "pulse" | "triangle"
  ) => {
    updateSettings({ ...settings, type: type });
    if (oscNumber === 1) {
      engine?.voices.forEach((v) => (v.oscillator.type = type));
      engine?.disconnectLFO("osc1 pulse width", 1);
    } else {
      engine?.voices.forEach((v) => (v.oscillator2.type = type));
    }

    if (type === "pulse") {
      oscNumber === 1
        ? engine?.voices.forEach((v) => {
            if (v.oscillator.width) {
              v.oscillator.width.value = settings.pulseWidth;
            }
          })
        : engine?.voices.forEach((v) => {
            if (v.oscillator2.width) {
              v.oscillator2.width.value = settings.pulseWidth;
            }
          });
    }
  };

  const updatePulseWidth = (value: number) => {
    updateSettings({ ...settings, pulseWidth: value });
    oscNumber === 1
      ? engine?.voices.forEach((v) => {
          if (v.oscillator.width) {
            v.oscillator.width.value = value;
          }
        })
      : engine?.voices.forEach((v) => {
          if (v.oscillator2.width) {
            v.oscillator2.width.value = value;
          }
        });
  };

  const updateCoarse = (value: number) => {
    updateSettings({ ...settings, transpose: value });
    engine?.setCoarse(value, oscNumber);
  };

  const updateFine = (value: number) => {
    updateSettings({ ...settings, detune: value });
    engine?.setFine(value, oscNumber);
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
    oscNumber === 1
      ? engine?.voices.forEach((v) => (v.oscillator.volume.value = value))
      : engine?.voices.forEach((v) => (v.oscillator2.volume.value = value));
  };
  return (
    <SectionWrapper name={`osc${oscNumber}`}>
      <div className={styles.container}>
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
              oscNumber === 1 ? "osc1 pulse width" : "osc2 pulse width"
            }
            radius={24}
            minValue={-1}
            maxValue={1}
            currentValue={settings.pulseWidth}
            step={0.01}
            onChange={updatePulseWidth}
            // lfoPercent={100}
            startingPoint={"middle"}
            interactive={settings.type === "pulse" ? true : false}
          />

          <Knob
            exponent={1}
            label={"coarse"}
            lfoParameter={oscNumber === 1 ? "osc1 coarse" : "osc2 coarse"}
            minValue={-24}
            maxValue={24}
            currentValue={settings.transpose}
            step={1}
            onChange={updateCoarse}
            radius={24}
            startingPoint={"middle"}
            interactive={true}

            // lfoAmount={lfo1?.find((lfo) => lfo.target === "osc1 coarse")?.amount}
          />
          <Knob
            exponent={1}
            label={"fine"}
            lfoParameter={oscNumber === 1 ? "osc1 fine" : "osc2 fine"}
            minValue={-100}
            maxValue={100}
            currentValue={settings.detune}
            step={1}
            onChange={updateFine}
            radius={24}
            startingPoint={"beginning"}
            interactive={true}
          />
          <Knob
            exponent={1}
            label={"volume"}
            lfoParameter={oscNumber === 1 ? "osc1 volume" : "osc2 volume"}
            minValue={-70}
            maxValue={12}
            unit={"db"}
            currentValue={settings.volume}
            step={0.5}
            onChange={updateVolume}
            radius={24}
            startingPoint={"middle"}
            interactive={true}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Oscillator;
