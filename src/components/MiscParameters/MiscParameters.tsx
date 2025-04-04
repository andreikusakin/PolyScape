"use client";

import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useUiColorRGB } from "@/lib/store/uiStore";
import Knob from "../Knob/Knob";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./MiscParameters.module.css";
import { useShallow } from "zustand/react/shallow";
import React from "react";

// PanSpread
// Unison
// HOLD

export const MiscParameters = React.memo(() => {
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const colorRGB = useUiColorRGB();
  const {
    panSpread,
    unison,
    updateUnison,
    setPanSpread,
    detune,
    setDetune,
    hold,
    updateHold,
  } = useSynthSettingsStore(
    useShallow((state) => ({
      panSpread: state.panSpread,
      unison: state.unison,
      setPanSpread: state.setPanSpread,
      updateUnison: state.updateUnison,
      detune: state.detune,
      setDetune: state.setDetune,
      hold: state.hold,
      updateHold: state.updateHold,
    }))
  );
  const updatePanSpread = (value: number) => {
    engine?.setPanSpread(value);
    setPanSpread(value);
  };

  const handleUnison = () => {
    updateUnison();
    engine?.updatetUnison();
  };

  const handleHold = () => {
    updateHold();
    engine?.updateHold();
  };

  const updateDetune = (value: number) => {
    engine?.setDetune(value);
    setDetune(value);
  };
  return (
    <SectionWrapper name="Misc">
      <div
        className={styles.grid}
        style={{ "--color-rgb": colorRGB } as React.CSSProperties}
      >
        <Knob
          
          label="Pan Spread"
          minValue={0}
          maxValue={100}
          step={0.1}
          unit="%"
          currentValue={panSpread}
          radius={24}
          interactive
          onChange={updatePanSpread}
        />
        <Knob
          
          label="Detune"
          minValue={0}
          maxValue={100}
          step={0.1}
          unit="%"
          currentValue={detune}
          radius={24}
          interactive
          onChange={updateDetune}
        />
        <div className={styles.right}>
          <button
            className={`${styles.button} ${unison ? styles.button_active : ""}`}
            onClick={handleUnison}
          >
            unison
          </button>
          <button
            className={`${styles.button} ${hold ? styles.button_active : ""}`}
            onClick={handleHold}
          >
            hold
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
});
