import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import styles from "./Keyboard.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { Keys } from "./Keys/Keys";
import { useState } from "react";

type KeyboardProps = {
  engine: CustomPolySynth;
  osc1Type: string;
  osc2Type: string;
};

export const Keyboard = ({ engine, osc1Type, osc2Type }: KeyboardProps) => {
  const [color, setColor] = useState<string>("255, 255, 0");

  return (
    <SectionWrapper>
      <div className={styles.container}>
        <Keys osc1Type={osc1Type} osc2Type={osc2Type} engine={engine} />
      </div>
    </SectionWrapper>
  );
};
