import Knob from "../Knob/Knob";
import styles from "./Noise.module.css";
import { NoiseShape } from "../Shapes";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { LFOTarget, Preset } from "@/lib/types/types";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { useSynthSettingsStore } from "@/lib/store/settingsStore";

type NoiseProps = {
  engine: CustomPolySynth | undefined;
  isSelectingLFO: false | 1 | 2;
  assignLFO: (target: LFOTarget, lfo: 1 | 2) => void;
};

export default function Noise({
  engine,
  isSelectingLFO,
  assignLFO,
}: NoiseProps) {
  const { settings, updateSettings } = useSynthSettingsStore((state) => ({
    settings: state.noise,
    updateSettings: state.setNoiseParams,
  }));
  const colorValue =
    settings.type === "white"
      ? "#FFFFFF"
      : settings.type === "pink"
      ? "#E859FF"
      : "#FF543D";

  const updateType = (type: "white" | "pink" | "brown") => {
    updateSettings({ type: type });
    engine?.voices.forEach((voice) => {
      voice.noise.type = type;
    });
  };

  const updateVolume = (value: number) => {
    updateSettings({ volume: value });
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
          assignLFO={assignLFO}
          isSelectingLFO={isSelectingLFO}
        />
      </div>
    </SectionWrapper>
  );
}
