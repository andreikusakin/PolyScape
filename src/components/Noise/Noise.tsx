import Knob from "../Knob/Knob";
import styles from "./Noise.module.css";
import { NoiseShape } from "../Shapes";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

export default function Noise() {
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const { settings, updateSettings } = useSynthSettingsStore(
    useShallow((state) => ({
      settings: state.noise,
      updateSettings: state.setNoiseParams,
    }))
  );
  const colorValue =
    settings.type === "white"
      ? "#FFFFFF"
      : settings.type === "pink"
      ? "#E859FF"
      : "#FF543D";

  const updateType = (type: "white" | "pink" | "brown") => {
    updateSettings({ ...settings, type: type });
    engine?.voices.forEach((voice) => {
      voice.noise.type = type;
    });
  };

  const updateVolume = (value: number) => {
    updateSettings({ ...settings, volume: value });
    engine?.LFO1.find((lfo) => lfo.target === "noise volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    });
    engine?.LFO2.find((lfo) => lfo.target === "noise volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    });
    engine?.voices.forEach((v) => (v.noise.volume.value = value));
  };
  return (
    <SectionWrapper name={"noise"}>
      <div className={styles.grid}>
        <ul className={styles.types}>
          <li
            onClick={() => updateType("white")}
            className={settings.type === "white" ? styles.selected : ""}
          >
            white
          </li>
          <li
            onClick={() => updateType("pink")}
            className={settings.type === "pink" ? styles.selected : ""}
          >
            pink
          </li>
          <li
            onClick={() => updateType("brown")}
            className={settings.type === "brown" ? styles.selected : ""}
          >
            red
          </li>
        </ul>
        <div className={styles.waveform}>
          <div className={styles.waveformAnimation}>
            <NoiseShape color={colorValue} />
          </div>
        </div>
        <Knob
          exponent={1}
          label={"volume"}
          lfoParameter={"noise volume"}
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
    </SectionWrapper>
  );
}
