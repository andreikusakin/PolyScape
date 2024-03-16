"use client";

import {
  useSynthEngineStore,
  useSynthSettingsStore,
  useWaveformColor,
} from "@/lib/store/settingsStore";
import Knob from "../Knob/Knob";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./MiscParameters.module.css";
import shallow from "zustand/shallow";
import { useShallow } from "zustand/react/shallow";

// PanSpread
// Unison
// HOLD

export const MiscParameters = () => {
  console.log("RERENDER MISC PARAMETERS");
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const colorRGB = useWaveformColor();
  const { panSpread, unison, updateUnison, setPanSpread, detune, setDetune, hold, updateHold } =
    useSynthSettingsStore(
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
    engine.setPanSpread(value);
    setPanSpread(value);
  };

  const handleUnison = () => {
    updateUnison();
    engine.updatetUnison();
  };

  const handleHold = () => {
    updateHold();
    engine.updateHold();
  }

  const updateDetune = (value: number) => {
    engine.setDetune(value);
    setDetune(value);
  };
  return (
    <SectionWrapper name="Misc">
      <div
        className={styles.grid}
        style={{ "--color-rgb": colorRGB } as React.CSSProperties}
      >
        <Knob
          exponent={1}
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
          exponent={1}
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
          <div
            className={`${styles.button} ${unison ? styles.button_active : ""}`}
            onClick={handleUnison}
          >
            unison
          </div>
          <div
            className={`${styles.button} ${hold ? styles.button_active : ""}`}
            onClick={handleHold}
           >hold</div>
        </div>
      </div>
    </SectionWrapper>
  );
};
