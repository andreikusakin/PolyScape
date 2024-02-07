import styles from "./Envelope.module.css";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";

type EnvelopeProps = {
  name: string;
  attack: number;
  setAttack: (attack: number) => void;
  decay: number;
  setDecay: (decay: number) => void;
  sustain: number;
  setSustain: (sustain: number) => void;
  release: number;
  setRelease: (release: number) => void;
};

export const Envelope = ({
  name,
  attack,
  setAttack,
  decay,
  setDecay,
  sustain,
  setSustain,
  release,
  setRelease,
}: EnvelopeProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>
        <Knob
          exponent={1}
          label="attack"
          unit={"s"}
          minValue={0}
          maxValue={20}
          currentValue={attack}
          step={0.01}
          onChange={setAttack}
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
          currentValue={decay}
          step={0.01}
          onChange={setDecay}
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
          currentValue={sustain}
          step={0.01}
          onChange={setSustain}
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
          currentValue={release}
          step={0.01}
          onChange={setRelease}
          radius={24}
          lfo={false}
          startingPoint="beginning"
          interactive={true}
        />
      </div>
    </div>
  );
};
