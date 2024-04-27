import styles from "./Filter.module.css";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";


export const Filter = () => {
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const { settings, updateSettings, envSettings, updateEnvSettings } = useSynthSettingsStore(useShallow((state) => ({
    settings: state.filter,
    updateSettings: state.setFilterParams,
    envSettings: state.filterEnvelope,
    updateEnvSettings: state.setFilterEnvelopeParams,
  })));
  const updateType = (type: "lowpass" | "highpass" | "bandpass" | "notch") => {
    updateSettings({...settings, type: type });
    engine?.voices.forEach((voice) => {
      voice.filter.type = type;
    });
  };

  const updateRolloff = (rolloff: Tone.FilterRollOff) => {
    updateSettings({...settings, rolloff: rolloff });
    engine?.voices.forEach((voice) => {
      voice.filter.rolloff = rolloff;
    });
  };

  const updateResonance = (resonance: number) => {
    updateSettings({...settings, Q: resonance });
    engine?.voices.forEach((voice) => {
      voice.filter.Q.value = resonance;
    });
  };

  const updateCutoff = (cutoff: number) => {
    updateEnvSettings({...envSettings, baseFrequency: cutoff });
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.baseFrequency = cutoff;
    });
  };

  const updateEnvelopeAmount = (amount: number) => {
    updateEnvSettings({...envSettings, octaves: amount });
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.octaves = amount;
    });
  };

  const updateAttack = (attack: number) => {
    updateEnvSettings({...envSettings, attack: attack });
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.attack = attack;
    });
  };

  const updateDecay = (decay: number) => {
    updateEnvSettings({...envSettings, decay: decay });
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.decay = decay;
    });
  };

  const updateSustain = (sustain: number) => {
    updateEnvSettings({...envSettings,  sustain: sustain });
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.sustain = sustain;
    });
  };

  const updateRelease = (release: number) => {
    updateEnvSettings({...envSettings, release: release });
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.release = release;
    });
  };

  return (
    <SectionWrapper name={"filter"}>
      <div className={styles.grid}>
        <div className={styles.typescontainer}>
          <ul className={styles.types}>
            <li
              onClick={() => updateType("lowpass")}
              className={settings.type === "lowpass" ? styles.selected : ""}
            >
              lp
            </li>
            <li
              onClick={() => updateType("highpass")}
              className={settings.type === "highpass" ? styles.selected : ""}
            >
              hp
            </li>
            <li
              onClick={() => updateType("bandpass")}
              className={settings.type === "bandpass" ? styles.selected : ""}
            >
              bp
            </li>
            <li
              onClick={() => updateType("notch")}
              className={settings.type === "notch" ? styles.selected : ""}
            >
              notch
            </li>
          </ul>
          <ul className={styles.types}>
            <li
              onClick={() => updateRolloff(-12)}
              className={settings.rolloff === -12 ? styles.selected : ""}
            >
              12
            </li>
            <li
              onClick={() => updateRolloff(-24)}
              className={settings.rolloff === -24 ? styles.selected : ""}
            >
              24
            </li>
            <li
              onClick={() => updateRolloff(-48)}
              className={settings.rolloff === -48 ? styles.selected : ""}
            >
              48
            </li>
          </ul>
        </div>

        <Knob
          exponent={1}
          label={"cutoff"}
          lfoParameter="filter cutoff"
          minValue={0}
          maxValue={20000}
          currentValue={envSettings.baseFrequency}
          step={1}
          unit={"hz"}
          onChange={updateCutoff}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          lfoParameter="filter resonance"
          label={"resonance"}
          minValue={0.01}
          maxValue={15}
          currentValue={settings.Q}
          step={0.01}
          onChange={updateResonance}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"envelope"}
          label2={"amount"}
          minValue={0}
          maxValue={7}
          currentValue={envSettings.octaves}
          step={0.01}
          onChange={updateEnvelopeAmount}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"attack"}
          unit={"s"}
          minValue={0.001}
          maxValue={20}
          currentValue={envSettings.attack}
          step={0.001}
          onChange={updateAttack}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"decay"}
          unit={"s"}
          minValue={0.001}
          maxValue={20}
          currentValue={envSettings.decay}
          step={0.001}
          onChange={updateDecay}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"sustain"}
          minValue={0}
          maxValue={1}
          currentValue={envSettings.sustain}
          step={0.01}
          onChange={updateSustain}
          radius={24}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"release"}
          unit={"s"}
          minValue={0.01}
          maxValue={20}
          currentValue={envSettings.release}
          step={0.01}
          onChange={updateRelease}
          radius={24}
          interactive={true}
        />
      </div>
    </SectionWrapper>
  );
};
