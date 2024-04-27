import { FxWrapper } from "../FxWrapper/FxWrapper";
import Knob from "../Knob/Knob";
import styles from "./Reverb.module.css";
import { fxProps, ReverbSettings } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";
import { Cube } from "./Cube/Cube";

export const Reverb = ({
  engine,
  settings,
  updateSettings,
  index,
}: fxProps) => {
  const updateMix = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, wet: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.Reverb).set({ wet: value / 100 });
  };
  const updateDecay = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, decay: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.Reverb).set({ decay: value });
  };
  const updatePreDelay = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, preDelay: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.Reverb).set({ preDelay: value });
  };

  const handleDelete = () => {
    if (engine) {
      const newSettings = settings.filter((effect, i) => i !== index);
      updateSettings(newSettings);

      engine.deleteEffect(index);
    }
  };

  return (
    <FxWrapper
      effectName="reverb"
      deleteFunction={handleDelete}
      effect={engine?.currentChain[index]}
      currentWet={settings[index].settings.wet}
    >
      <div className={styles.grid}>
        {/* <div className={`${styles.label} `}>
          <h3>rev</h3>
          <h3>erb</h3>
        </div> */}
        <Cube />
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
          onChange={updateDecay}
          minValue={0.001}
          maxValue={10}
          step={0.001}
          unit="s"
          currentValue={(settings[index].settings as ReverbSettings).decay || 2}
          label="decay"
          radius={24}
          interactive
        />
        <Knob
          onChange={updatePreDelay}
          minValue={0.001}
          maxValue={1}
          step={0.001}
          unit="s"
          currentValue={(settings[index].settings as ReverbSettings).preDelay || 0.01}
          label="predelay"
          radius={24}
          interactive
        />
      </div>
    </FxWrapper>
  );
};
