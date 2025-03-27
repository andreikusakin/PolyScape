import { LFOTarget } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import styles from "./LFO.module.css";
import Knob from "../Knob/Knob";
import { OscillatorWaveform } from "../OscillatorWaveform";
import { Slider } from "../Slider/Slider";
import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";
import React from "react";

type LFOProps = {
  lfoNumber: 1 | 2;
};

export const LFO = React.memo(({ lfoNumber }: LFOProps) => {
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const { settings, updateSettings, setIsSelecting } = useSynthSettingsStore(
    useShallow(
    (state) => ({
      settings: lfoNumber === 1 ? state.lfo1 : state.lfo2,
      updateSettings:
        lfoNumber === 1 ? state.setLFO1Params : state.setLFO2Params,
      setIsSelecting: state.setIsSelectingLFO,
    }))
  );

  const selectedLFO = lfoNumber === 1 ? engine?.LFO1 : engine?.LFO2;

  const handleAssignClick = () => {
    setIsSelecting(lfoNumber);
  };

  const updateWaveformType = (
    newType: "sine" | "sawtooth" | "square" | "triangle"
  ) => {
    updateSettings({ ...settings, type: newType });
    selectedLFO?.forEach((lfo) => (lfo.LFO.type = newType));
  };

  const updateRate = (value: Tone.Unit.Frequency) => {
    updateSettings({ ...settings, rate: value });
    selectedLFO?.forEach((lfo) => (lfo.LFO.frequency.value = value));
  };

  const handleDoubleClick = (target: LFOTarget) => {
    updateSettings({
      ...settings,
      destinations: settings.destinations.filter(
        (d) => d.target !== target
      ),
    });
    engine?.disconnectLFO(target, lfoNumber);
  };

  const updateLFOAmount = (target: LFOTarget, amount: number) => {
    updateSettings({
      ...settings,
      destinations: settings.destinations.map((d) =>
        d.target === target ? { ...d, amount: amount } : d
      ),
    });
    selectedLFO?.forEach((lfo) => {
      if (lfo.target === target) {
        lfo.LFO.amplitude.value = amount;
      }
    });
  };

  return (
    <div>
      <div className={styles.name}>{`lfo${lfoNumber}`}</div>
      <div
        className={[
          styles.container,
          lfoNumber === 1 ? styles.borderLFO1 : styles.borderLFO2,
        ].join(" ")}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
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
              onClick={() => updateWaveformType("square")}
              className={settings.type === "square" ? styles.selected : ""}
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
          <div className={styles.rate}>
            <Knob
              radius={24}
              label={"rate"}
              interactive={true}
              minValue={0}
              maxValue={200}
              step={0.01}
              currentValue={settings.rate || 0}
              onChange={updateRate}
              exponent={1}
              startingPoint={"beginning"}
              sync={settings.sync}
              unit={settings.sync ? "" : "Hz"}
            />
          </div>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div className={styles.waveform}>
            <div className={styles.waveformAnimation}>
              <OscillatorWaveform oscType={settings.type || "sine"} />
            </div>
          </div>
          <button
            onClick={() => {
              updateSettings({
                ...settings,
                sync: !settings.sync,
                rate: settings.sync ? "4n" : 1,
              });

              // setRate(settings.sync ? "4n" : 1);
            }}
            className={[
              styles.sync,
              settings.sync
                ? lfoNumber === 1
                  ? styles.sync_activeLFO1
                  : styles.sync_activeLFO2
                : "",
            ].join(" ")}
          >
            <label>sync</label>
          </button>
        </div>
        <div className={styles.destinations}>
          <div className={styles.underlay}>
            <button className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </button>
            <button className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </button>
            <button className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </button>
            <button className={styles.selector} onClick={handleAssignClick}>
              <label>assign</label>
            </button>
          </div>
          <div className={styles.targets}>
            {settings.destinations.map((d, i) => (
              <Slider
                key={i}
                lfoName={`lfo${lfoNumber}`}
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
});
