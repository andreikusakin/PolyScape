import { FxWrapper } from "../FxWrapper/FxWrapper";
import Knob from "../Knob/Knob";
import styles from "./Reverb.module.css";
import localFont from "next/font/local";

const kodeMono = localFont({ src: "./KodeMono-VariableFont_wght.ttf" });

export const Reverb = () => {
  return (
    <FxWrapper effectName="reverb" enabled={true}>
      <div className={styles.grid}>
        <div className={`${styles.label} ${kodeMono.className}`}>
          <h3>rev</h3>
          <h3>erb</h3>
        </div>
        <Knob label="mix" radius={24} interactive={true} />
        <Knob label="decay" radius={24} interactive={true} />
        <Knob label="predelay" radius={24} interactive={true} />
      </div>
      
    </FxWrapper>
  );
};
