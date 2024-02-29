import { Preset } from "@/lib/types/types";
import { PingPongDelay } from "../PingPongDelay/PingPongDelay";
import { Reverb } from "../Reverb/Reverb";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Effects.module.css";
import CustomEffects from "@/lib/engines/CustomEffects";

type EffectsProps = {
  settings: Preset["effects"];
  updateSettings: (settings: Preset["effects"]) => void;
  engine: CustomEffects;
};

export const Effects = ({ settings, updateSettings, engine }: EffectsProps) => {
  const addNewEffect = (type: string) => {
    const newEffect = {
      type: type,
      settings: { wet: 50 },
    };
    updateSettings([...settings, newEffect]);
    engine.addEffect(type);
  };

  return (
    <div className={styles.wrapper}>
      <SectionWrapper>
        <div className={styles.container}>
          {settings?.map((effect, index) => {
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
