import styles from "./EnvelopeAmplitude.module.css";
import Knob from "../Knob/Knob";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { useSynthEngineStore, useSynthSettingsStore } from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";


export const EnvelopeAmplitude = () => {
  console.log("RERENDER ENVELOPE AMPLITUDE")
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const { settings, updateSettings } = useSynthSettingsStore(useShallow((state) => ({
    settings: state.envelopeAmplitude,
    updateSettings: state.setEnvAmplitudeParams,
  })));
  const updateAttack = (attack: number) => {
    updateSettings({ ...settings, attack });
    engine?.voices.forEach((voice) => {
      voice.envelope.attack = attack;
    });
  };

  const updateDecay = (decay: number) => {
    updateSettings({ ...settings, decay });
    engine?.voices.forEach((voice) => {
      voice.envelope.decay = decay;
    });
  };

  const updateSustain = (sustain: number) => {
    updateSettings({ ...settings, sustain });
    engine?.voices.forEach((voice) => {
      voice.envelope.sustain = sustain;
    });
  };

  const updateRelease = (release: number) => {
    updateSettings({ ...settings, release });
    engine?.voices.forEach((voice) => {
      voice.envelope.release = release;
    });
  };

  return (
    <SectionWrapper name={"amplitude"}>
      <div className={styles.grid}>
        <Knob
          exponent={1}
          label={"attack"}
          unit={"s"}
          minValue={0.001}
          maxValue={20}
          currentValue={settings.attack}
          step={0.001}
          onChange={updateAttack}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label="decay"
          unit={"s"}
          minValue={0.001}
          maxValue={20}
          currentValue={settings.decay}
          step={0.01}
          onChange={updateDecay}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label="sustain"
          minValue={0}
          maxValue={1}
          currentValue={settings.sustain}
          step={0.01}
          onChange={updateSustain}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label="release"
          unit={"s"}
          minValue={0}
          maxValue={20}
          currentValue={settings.release}
          step={0.01}
          onChange={updateRelease}
          radius={24}
          interactive={true}
        />
      </div>
    </SectionWrapper>
  );
};
