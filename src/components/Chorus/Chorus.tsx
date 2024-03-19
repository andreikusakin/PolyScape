import { FxWrapper } from "../FxWrapper/FxWrapper";
import Knob from "../Knob/Knob";
import styles from "./Chorus.module.css";
import { ChorusImage } from "./ChorusImage/ChorusImage";
import { fxProps } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";

// frequency (rate), delay (0.5 - 20ms), depth, feedback, wet

export const Chorus = ({
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
      (engine.currentChain[index] as Tone.Chorus).set({
        wet: value / 100,
      });
  };

  const updateRate = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, frequency: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine.currentChain[index])
      (engine.currentChain[index] as Tone.Chorus).set({
        frequency: value,
      });
  };

  const updateDelay = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, delayTime: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine.currentChain[index])
      (engine.currentChain[index] as Tone.Chorus).set({
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
      (engine.currentChain[index] as Tone.Chorus).set({
        feedback: value,
      });
  };

  const updateDepth = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, depth: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine.currentChain[index])
      (engine.currentChain[index] as Tone.Chorus).set({
        depth: value,
      });
  };

  return (
    <FxWrapper
      effectName="chorus"
      deleteFunction={handleDelete}
      effect={engine?.currentChain[index]}
      currentWet={settings[index].settings.wet}
    >
      <div className={styles.grid}>
        <Knob
          onChange={updateRate}
          minValue={0.1}
          maxValue={20}
          step={0.01}
          unit={"hz"}
          currentValue={settings[index].settings.frequency ?? 4}
          label="rate"
          radius={24}
          interactive
        />
        <ChorusImage />
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
          onChange={updateDelay}
          minValue={0.5}
          maxValue={20}
          step={0.01}
          unit={"ms"}
          currentValue={settings[index].settings.delayTime ?? 3.5}
          label="delay"
          radius={24}
          interactive
        />
        <Knob
          onChange={updateFeedback}
          minValue={0}
          maxValue={1}
          step={0.01}
          unit={""}
          currentValue={settings[index].settings.feedback ?? 0.2}
          label="feedback"
          radius={24}
          interactive
        />
        <Knob
          onChange={updateDepth}
          minValue={0}
          maxValue={1}
          step={0.01}
          unit={""}
          currentValue={settings[index].settings.depth ?? 0.7}
          label="depth"
          radius={24}
          interactive
        />
      </div>
    </FxWrapper>
  );
};
