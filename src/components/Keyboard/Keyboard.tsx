import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import styles from "./Keyboard.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { Keys } from "./Keys/Keys";
import { useState } from "react";

type KeyboardProps = {
  engine: CustomPolySynth;
};

export const Keyboard = ({ engine }: KeyboardProps) => {
  return (
    <SectionWrapper>
      <div className={styles.container}>
        <Keys engine={engine} />
      </div>
    </SectionWrapper>
  );
};
