import { fxProps } from "@/lib/types/types";
import styles from "./BitCrusher.module.css";
import { FxWrapper } from "../FxWrapper/FxWrapper";

export const BitCrusher = ({
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
  return (
    <FxWrapper
      effectName="bitcrusher"
      deleteFunction={handleDelete}
      effect={engine.currentChain[index]}
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
            currentValue={settings[index].settings.distortion ?? 0.5}
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
  )
}
