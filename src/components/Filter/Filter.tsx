import styles from "./Filter.module.css";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";

type FilterProps = {
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
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>
        <div className={styles.typescontainer}>
          <ul className={styles.types}>
            <li
              onClick={() => setFilterType("lowpass")}
              className={filterType === "lowpass" ? styles.selected : ""}
            >
              lp
            </li>
            <li
              onClick={() => setFilterType("highpass")}
              className={filterType === "highpass" ? styles.selected : ""}
            >
              hp
            </li>
            <li
              onClick={() => setFilterType("bandpass")}
              className={filterType === "bandpass" ? styles.selected : ""}
            >
              bp
            </li>
            <li
              onClick={() => setFilterType("notch")}
              className={filterType === "notch" ? styles.selected : ""}
            >
              notch
            </li>
          </ul>
          <ul className={styles.types}>
            <li
                onClick={() => setRolloff(-12)}
                className={rolloff === -12 ? styles.selected : ""}            
            >12</li>
            <li
                onClick={() => setRolloff(-24)}
                className={rolloff === -24 ? styles.selected : ""}
            >24</li>
            <li 
                onClick={() => setRolloff(-48)}
                className={rolloff === -48 ? styles.selected : ""}
            >48</li>
          </ul>
        </div>

        <Knob
          label={"cutoff"}
          minValue={0}
          maxValue={20000}
          currentValue={frequency}
          step={1}
          unit={"hz"}
          updateValue={setFrequency}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"resonance"}
          minValue={0.01}
          maxValue={15}
          currentValue={resonance}
          step={0.01}
          updateValue={setResonance}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"envelope"}
          label2={"amount"}
          minValue={0}
          maxValue={7}
          currentValue={envAmount}
          step={0.01}
          updateValue={setEnvAmount}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"attack"}
          minValue={0.01}
          maxValue={10}
          currentValue={attack}
          step={0.01}
          updateValue={setAttack}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"decay"}
          minValue={0.01}
          maxValue={100}
          currentValue={decay}
          step={0.01}
          updateValue={setDecay}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"sustain"}
          minValue={0}
          maxValue={1}
          currentValue={sustain}
          step={0.01}
          updateValue={setSustain}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
        <Knob
          label={"release"}
          minValue={0.01}
          maxValue={10}
          currentValue={release}
          step={0.01}
          updateValue={setRelease}
          radius={24}
          lfo={false}
          startingPoint={"beginning"}
          interactive={true}
        />
      </div>
    </div>
  );
};
