import { FxWrapper } from "../FxWrapper/FxWrapper";
import Knob from "../Knob/Knob";
import styles from "./PingPongDelay.module.css";
import localFont from "next/font/local";
import { Rackets } from "./Rackets/Rackets";
import { fxProps } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";

const micro5 = localFont({ src: "./Micro5-Regular.ttf" });

export const PingPongDelay = ({
  engine,
  settings,
  updateSettings,
  index,
}: fxProps) => {
  const handleDelete = () => {
    const newSettings = settings.filter((effect, i) => i !== index);
    updateSettings(newSettings);
    engine?.deleteEffect(index);
  };
  return (
    <FxWrapper
      effectName="ping-pong-delay"
      deleteFunction={handleDelete}
      effect={engine?.currentChain[index]}
      currentWet={settings[index].settings.wet}
    >
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
