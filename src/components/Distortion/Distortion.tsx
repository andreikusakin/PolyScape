import { DistortionSettings, fxProps } from "@/lib/types/types";
import styles from "./Distortion.module.css";
import { FxWrapper } from "../FxWrapper/FxWrapper";
import { DistortionIcon } from "./DistortionIcon/DistortionIcon";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";

export const Distortion = ({
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
      (engine.currentChain[index] as Tone.Distortion).set({
        wet: value / 100,
      });
  };

  const updateDrive = (value: number) => {
    const newSettings = settings.map((effect, i) =>
      i === index
        ? { ...effect, settings: { ...effect.settings, distortion: value } }
        : effect
    );
    updateSettings(newSettings);
    if (engine?.currentChain[index])
      (engine.currentChain[index] as Tone.Distortion).set({
        distortion: value,
      });
  }
  return (
    <FxWrapper
      effectName="distortion"
      deleteFunction={handleDelete}
      effect={engine?.currentChain[index]}
      currentWet={settings[index].settings.wet}
    >
      <div className={styles.container}>
        
        <DistortionIcon />
        
          <Knob
            onChange={updateDrive}
            minValue={0}
            maxValue={1}
            step={0.01}
            unit={""}
            currentValue={(settings[index].settings as DistortionSettings).distortion ?? 0.5}
            label="drive"
            radius={24}
            interactive
          />
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
        
      </div>
    </FxWrapper>
  );
};
