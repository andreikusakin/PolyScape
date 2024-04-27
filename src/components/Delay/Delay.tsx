import { FxWrapper } from "../FxWrapper/FxWrapper";
import Knob from "../Knob/Knob";
import styles from "./Delay.module.css";
import { FeedbackDelaySettings, fxProps } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import { DelayImage } from "./DelayImage/DelayImage";

export const Delay = ({
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
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.FeedbackDelay).set({
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
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.FeedbackDelay).set({
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
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.FeedbackDelay).set({
        feedback: value,
      });
  };

  return (
    <FxWrapper
      effectName="delay"
      deleteFunction={handleDelete}
      effect={engine?.currentChain[index]}
      currentWet={settings[index].settings.wet}
    >
      <div className={styles.grid}>
        <div className={`${styles.label}`}>
          <DelayImage />
        </div>
        <Knob
          onChange={updateMix}
          minValue={0}
          maxValue={100}
          step={0.1}
          unit={"%"}
          currentValue={settings[index].settings.wet ?? 50}
          label="Dry/Wet"
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
          currentValue={(settings[index].settings as FeedbackDelaySettings).delayTime || "8n"}
          onChange={updateRate}
        />
        <Knob
          label="feedback"
          radius={24}
          interactive={true}
          minValue={0}
          maxValue={1}
          step={0.01}
          currentValue={(settings[index].settings as FeedbackDelaySettings).feedback || 0.5}
          onChange={updateFeedback}
        />
      </div>
    </FxWrapper>
  );
};
