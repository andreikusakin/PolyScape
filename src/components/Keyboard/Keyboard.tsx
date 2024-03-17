import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import styles from "./Keyboard.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { Keys } from "./Keys/Keys";
import { useState } from "react";

export const Keyboard = () => {
  return (
    <div className={styles.wrapper}>
      <SectionWrapper>
        <div className={styles.container}>
          <Keys />
        </div>
      </SectionWrapper>
    </div>
  );
};
