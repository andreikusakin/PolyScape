import { Preset } from "@/lib/types/types";
import { PingPongDelay } from "../PingPongDelay/PingPongDelay";
import { Reverb } from "../Reverb/Reverb";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Effects.module.css";
import CustomEffects from "@/lib/engines/CustomEffects";
import { useEffectsEngineStore, useSynthSettingsStore } from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type EffectsProps = {
  
};

export const Effects = () => {
  const engine = useEffectsEngineStore((state) => state.effectsEngine);
  const {settings, updateSettings} = useSynthSettingsStore(useShallow((state) => ({
    settings: state.fxSettings,
    updateSettings: state.setFxSettings,
  })));
  const addNewEffect = (type: string) => {
    const newEffect = {
      type: type,
      settings: { wet: 50 },
    };
    updateSettings([...settings, newEffect]);
    engine.addEffect(type);
  };
 console.log("RERENDER EFFECTS")
  return (
    <div className={styles.wrapper}>
      <SectionWrapper>
        <div className={styles.container}>
          {settings && settings.map((effect, index) => {
            switch (effect.type) {
              case "reverb":
                return (
                  <Reverb
                    key={index}
                    index={index}
                    engine={engine}
                    settings={settings}
                    updateSettings={updateSettings}
                  />
                );
              case "pingPongDelay":
                return (
                  <PingPongDelay
                    key={index}
                    index={index}
                    engine={engine}
                    settings={settings}
                    updateSettings={updateSettings}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
        <button
          onClick={() => addNewEffect("reverb")}
          className={styles.add_effect}
        >
          add effect
        </button>
      </SectionWrapper>
    </div>
  );
};
