import styles from "./Filter.module.css";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";

type FilterProps = {
  engine: CustomPolySynth | undefined;
  name: string;
  filterType: "lowpass" | "highpass" | "bandpass" | "notch";
  setFilterType: (type: "lowpass" | "highpass" | "bandpass" | "notch") => void;
  frequency: number;
  setFrequency: (frequency: number) => void;
  resonance: number;
  setResonance: (resonance: number) => void;
  rolloff: Tone.FilterRollOff;
  setRolloff: (rolloff: Tone.FilterRollOff) => void;
  envAmount: number;
  setEnvAmount: (envAmount: number) => void;
  attack: number;
  setAttack: (attack: number) => void;
  decay: number;
  setDecay: (decay: number) => void;
  sustain: number;
  setSustain: (sustain: number) => void;
  release: number;
  setRelease: (release: number) => void;
};

export const Filter = ({
  engine,
  name,
  filterType,
  setFilterType,
  frequency,
  setFrequency,
  resonance,
  setResonance,
  rolloff,
  setRolloff,
  envAmount,
  setEnvAmount,
  attack,
  setAttack,
  decay,
  setDecay,
  sustain,
  setSustain,
  release,
  setRelease,
}: FilterProps) => {
  const updateType = (type: "lowpass" | "highpass" | "bandpass" | "notch") => {
    setFilterType(type);
    engine?.voices.forEach((voice) => {
      voice.filter.type = type;
    });
  };

  const updateRolloff = (rolloff: Tone.FilterRollOff) => {
    setRolloff(rolloff);
    engine?.voices.forEach((voice) => {
      voice.filter.rolloff = rolloff;
    });
  };

  const updateCutoff = (cutoff: number) => {
    setFrequency(cutoff);
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.baseFrequency = cutoff;
    });
  };

  const updateResonance = (resonance: number) => {
    setResonance(resonance);
    engine?.voices.forEach((voice) => {
      voice.filter.Q.value = resonance;
    });
  };

  const updateEnvelopeAmount = (amount: number) => {
    setEnvAmount(amount);
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.octaves = amount;
    });
  };

  const updateAttack = (attack: number) => {
    setAttack(attack);
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.attack = attack;
    });
  };

  const updateDecay = (decay: number) => {
    setDecay(decay);
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.decay = decay;
    });
  };

  const updateSustain = (sustain: number) => {
    setSustain(sustain);
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.sustain = sustain;
    });
  };

  const updateRelease = (release: number) => {
    setRelease(release);
    engine?.voices.forEach((voice) => {
      voice.filterEnvelope.release = release;
    });
  };

  return (
    <SectionWrapper name={name}>
      <div className={styles.grid}>
        <div className={styles.typescontainer}>
          <ul className={styles.types}>
            <li
              onClick={() => updateType("lowpass")}
              className={filterType === "lowpass" ? styles.selected : ""}
            >
              lp
            </li>
            <li
              onClick={() => updateType("highpass")}
              className={filterType === "highpass" ? styles.selected : ""}
            >
              hp
            </li>
            <li
              onClick={() => updateType("bandpass")}
              className={filterType === "bandpass" ? styles.selected : ""}
            >
              bp
            </li>
            <li
              onClick={() => updateType("notch")}
              className={filterType === "notch" ? styles.selected : ""}
            >
              notch
            </li>
          </ul>
          <ul className={styles.types}>
            <li
              onClick={() => updateRolloff(-12)}
              className={rolloff === -12 ? styles.selected : ""}
            >
              12
            </li>
            <li
              onClick={() => updateRolloff(-24)}
              className={rolloff === -24 ? styles.selected : ""}
            >
              24
            </li>
            <li
              onClick={() => updateRolloff(-48)}
              className={rolloff === -48 ? styles.selected : ""}
            >
              48
            </li>
          </ul>
        </div>

        <Knob
          exponent={1}
          label={"cutoff"}
          minValue={0}
          maxValue={20000}
          currentValue={frequency}
          step={1}
          unit={"hz"}
          onChange={updateCutoff}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"resonance"}
          minValue={0.01}
          maxValue={15}
          currentValue={resonance}
          step={0.01}
          onChange={updateResonance}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"envelope"}
          label2={"amount"}
          minValue={0}
          maxValue={7}
          currentValue={envAmount}
          step={0.01}
          onChange={updateEnvelopeAmount}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"attack"}
          unit={"s"}
          minValue={0.001}
          maxValue={20}
          currentValue={attack}
          step={0.001}
          onChange={updateAttack}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"decay"}
          unit={"s"}
          minValue={0.001}
          maxValue={20}
          currentValue={decay}
          step={0.001}
          onChange={updateDecay}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"sustain"}
          minValue={0}
          maxValue={1}
          currentValue={sustain}
          step={0.01}
          onChange={updateSustain}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          exponent={1}
          label={"release"}
          unit={"s"}
          minValue={0.01}
          maxValue={20}
          currentValue={release}
          step={0.01}
          onChange={updateRelease}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
      </div>
    </SectionWrapper>
  );
};
