import { BitCrusherSettings, fxProps } from "@/lib/types/types";
import styles from "./BitCrusher.module.css";
import { FxWrapper } from "../FxWrapper/FxWrapper";
import { BitCrusherImage } from "./BitCrusherImage/BitCrusherImage";
import Knob from "../Knob/Knob";
import * as Tone from "tone/build/esm/index";


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
      const updateMix = (value: number) => {
        const newSettings = settings.map((effect, i) =>
          i === index
            ? { ...effect, settings: { ...effect.settings, wet: value } }
            : effect
        );
        updateSettings(newSettings);
        if (engine?.currentChain[index])
          (engine.currentChain[index] as Tone.BitCrusher).set({
            wet: value / 100,
          });
      };
      const updateBitDepth = (value: number) => {
        const newSettings = settings.map((effect, i) =>
          i === index
            ? { ...effect, settings: { ...effect.settings, bits: value } }
            : effect
        );
        updateSettings(newSettings);
        if (engine?.currentChain[index])
          (engine.currentChain[index] as Tone.BitCrusher).set({
            bits: value,
          });
      }
  return (
    <FxWrapper
      effectName="bitcrusher"
      deleteFunction={handleDelete}
      effect={engine?.currentChain[index]}
      currentWet={settings[index].settings.wet}
    >
      <div className={styles.container}>
        
        <BitCrusherImage />
        
          <Knob
            onChange={updateBitDepth}
            minValue={1}
            maxValue={16}
            step={0.1}
            unit={"bits"}
            currentValue={(settings[index].settings as BitCrusherSettings).bits ?? 8}
            label="Bit Depth"
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
