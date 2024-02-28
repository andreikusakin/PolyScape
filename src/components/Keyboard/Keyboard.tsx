import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import styles from "./Keyboard.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { Keys } from "./Keys/Keys";

type KeyboardProps = {
  engine: CustomPolySynth;
};

export const Keyboard = ({ engine }: KeyboardProps) => {
  return (
    <SectionWrapper>
      <div className={styles.container}><Keys colorRGB={"255, 255, 0"}/></div>
    </SectionWrapper>
  );
};
