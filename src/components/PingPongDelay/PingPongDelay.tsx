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
    if (engine) {
      const newSettings = settings.filter((effect, i) => i !== index);
      updateSettings(newSettings);
      engine.deleteEffect(index);
    }
  };

  const updateMix = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, wet: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine.currentChain[index])
      (engine.currentChain[index] as Tone.PingPongDelay).set({
        wet: value / 100,
      });
  };
  const updateRate = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, delayTime: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine.currentChain[index])
      (engine.currentChain[index] as Tone.PingPongDelay).set({
        delayTime: value,
      });
  };

  const updateFeedback = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, feedback: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine.currentChain[index])
      (engine.currentChain[index] as Tone.PingPongDelay).set({
        feedback: value,
      });
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
        </div>
        <Knob
          onChange={updateMix}
          minValue={0}
          maxValue={100}
          step={0.1}
          unit={"%"}
          currentValue={settings[index].settings.wet ?? 50}
          label="mix"
          radius={24}
          interactive
        />
        <Knob
          label="rate"
          radius={24}
          interactive={true}
          sync={true}
          minValue={0}
          maxValue={200}
          step={0.01}
          currentValue={settings[index].settings.delayTime || "8n"}
          onChange={updateRate}
        />
        <Knob
          label="feedback"
          radius={24}
          interactive={true}
          minValue={0}
          maxValue={1}
          step={0.01}
          currentValue={settings[index].settings.feedback || 0.5}
          onChange={updateFeedback}
        />
      </div>
    </FxWrapper>
  );
};
