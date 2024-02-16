import styles from "./Envelope.module.css";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";

type EnvelopeProps = {
  engine: CustomPolySynth | undefined;
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
  engine,
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

  const updateAttack = (attack: number) => {
    setAttack(attack);
    engine?.voices.forEach((voice) => {
      voice.envelope.attack = attack;
    });
  };

  const updateDecay = (decay: number) => {
    setDecay(decay);
    engine?.voices.forEach((voice) => {
      voice.envelope.decay = decay;
    });
  };

  const updateSustain = (sustain: number) => {
    setSustain(sustain);
    engine?.voices.forEach((voice) => {
      voice.envelope.sustain = sustain;
    });
  };

  const updateRelease = (release: number) => {
    setRelease(release);
    engine?.voices.forEach((voice) => {
      voice.envelope.release = release;
    });
  };

  return (
    <SectionWrapper name={name} wide={true}>
      <Knob
        exponent={1}
        label="attack"
        unit={"s"}
        minValue={0}
        maxValue={20}
        currentValue={attack}
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
        currentValue={decay}
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
        currentValue={sustain}
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
        currentValue={release}
        step={0.01}
        onChange={updateRelease}
        radius={24}
        lfo={false}
        startingPoint="beginning"
        interactive={true}
      />
    </SectionWrapper>
  );
};
