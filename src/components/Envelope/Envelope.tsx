import styles from "./Envelope.module.css";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { Preset } from "@/lib/types/types";

type EnvelopeProps = {
  engine: CustomPolySynth | undefined;
  name: string;
  settings: Preset["envelope"];
  updateSettings: (settings: Preset["envelope"]) => void;
};

export const Envelope = ({
  engine,
  name,
  settings,
  updateSettings,
}: EnvelopeProps) => {
  const updateAttack = (attack: number) => {
    updateSettings({ ...settings, attack: attack });
    engine?.voices.forEach((voice) => {
      voice.envelope.attack = attack;
    });
  };

  const updateDecay = (decay: number) => {
    updateSettings({ ...settings, decay: decay });
    engine?.voices.forEach((voice) => {
      voice.envelope.decay = decay;
    });
  };

  const updateSustain = (sustain: number) => {
    updateSettings({ ...settings, sustain: sustain });
    engine?.voices.forEach((voice) => {
      voice.envelope.sustain = sustain;
    });
  };

  const updateRelease = (release: number) => {
    updateSettings({ ...settings, release: release });
    engine?.voices.forEach((voice) => {
      voice.envelope.release = release;
    });
  };

  return (
    <SectionWrapper name={name}>
      <div className={styles.grid}>
        <Knob
          exponent={1}
          label="attack"
          unit={"s"}
          minValue={0}
          maxValue={20}
          currentValue={settings.attack}
          step={0.01}
          onChange={updateAttack}
          radius={24}
          lfo={false}
          startingPoint="beginning"
          interactive={true}
        />
        <Knob
          exponent={1}
          label="decay"
          unit={"s"}
          minValue={0}
          maxValue={20}
          currentValue={settings.decay}
          step={0.01}
          onChange={updateDecay}
          radius={24}
          lfo={false}
          startingPoint="beginning"
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
          lfo={false}
          startingPoint="beginning"
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
          lfo={false}
          startingPoint="beginning"
          interactive={true}
        />
      </div>
    </SectionWrapper>
  );
};
