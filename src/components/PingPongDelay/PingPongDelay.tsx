import { FxWrapper } from "../FxWrapper/FxWrapper";
import Knob from "../Knob/Knob";
import styles from "./PingPongDelay.module.css";
import localFont from "next/font/local";
import Image from "next/image";
import { Rackets } from "./Rackets/Rackets";

const micro5 = localFont({ src: "./Micro5-Regular.ttf" });

export const PingPongDelay = () => {
  return (
    <FxWrapper effectName="ping-pong-delay" enabled={true}>
      <div className={styles.grid}>
        <div className={`${styles.label} ${micro5.className}`}>
          <Rackets />
          <h3>ping pong</h3>
          <h3>delay</h3>
        </div>
        <Knob label="mix" radius={24} interactive={true} />
        <Knob label="rate" radius={24} interactive={true} />
        <Knob label="feedback" radius={24} interactive={true} />
      </div>
    </FxWrapper>
  );
};