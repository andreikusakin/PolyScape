"use client";

import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import Knob from "../Knob/Knob";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./MiscParameters.module.css";
import shallow from "zustand/shallow";
import { useShallow } from 'zustand/react/shallow'

// PanSpread
// Unison
// Vintage knob

export const MiscParameters = () => {
  console.log("RERENDER MISC PARAMETERS")
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const { panSpread, unison, setPanSpread, setUnison, detune, setDetune } =
    useSynthSettingsStore(useShallow((state) => ({
      panSpread: state.panSpread,
      unison: state.unison,
      setPanSpread: state.setPanSpread,
      setUnison: state.setUnison,
      detune: state.detune,
      setDetune: state.setDetune,
    })));
  const updatePanSpread = (value: number) => {
    engine.setPanSpread(value);
    setPanSpread(value);
  };
  const updateUnison = (value: number) => {
    engine.setUnison(value);
    setUnison(value);
  };

  const handleUnison = () => {
    setUnison(!unison);
    engine.unison = !unison;

  }

    const updateDetune = (value: number) => {
        engine.voices.forEach((v, i) => {
            const currentDetuneOsc1 = v.oscillator.detune.value;
            const currentDetuneOsc2 = v.oscillator2.detune.value;
            const coefficientOsc1 = i % 2 === 0 ? -1 : 1;
            const coefficientOsc2 = i % 2 === 0 ? 1 : -1;
            const randomValue = Math.random() * (value - value / 4 + 1) + value / 4;
            v.oscillator.detune.value = v.oscillator.detune.value - (currentDetuneOsc1 + coefficientOsc1) + (randomValue * coefficientOsc1);
            v.oscillator2.detune.value = v.oscillator2.detune.value - (currentDetuneOsc2 + coefficientOsc2) + (randomValue * coefficientOsc2);
            
        }
            )
            setDetune(value);
    };
  return (
    <SectionWrapper name="Misc">
      <div className={styles.grid}>
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
        <div className={styles.unison} onClick={handleUnison}>unison</div>
      </div>
    </SectionWrapper>
  );
};
