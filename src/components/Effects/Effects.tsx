import { Preset } from "@/lib/types/types";
import { PingPongDelay } from "../PingPongDelay/PingPongDelay";
import { Reverb } from "../Reverb/Reverb";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Effects.module.css";
import {
  useEffectsEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";
import { AddEffect } from "../AddEffect/AddEffect";
import { useState } from "react";
import { IconPlus } from '@tabler/icons-react';
import { Distortion } from "../Distortion/Distortion";
import { Chorus } from "../Chorus/Chorus";

type EffectsProps = {};

export const Effects = () => {
  const engine = useEffectsEngineStore((state) => state.effectsEngine);
  const { settings, updateSettings } = useSynthSettingsStore(
    useShallow((state) => ({
      settings: state.fxSettings,
      updateSettings: state.setFxSettings,
    }))
  );
  const addNewEffect = (type: string) => {
    const newEffect = {
      type: type,
      settings: { wet: 50 },
    };
    updateSettings([...settings, newEffect]);
    engine.addEffect(type);
  };
  const [isAddEffectOpen, setIsAddEffectOpen] = useState(false);
  console.log("RERENDER EFFECTS");
  return (
    <div className={styles.wrapper}>
      <SectionWrapper>
        {isAddEffectOpen ? (
          <AddEffect
            addNewEffect={addNewEffect}
            setIsAddEffectOpen={setIsAddEffectOpen}
          />
        ) : (
          <>
            <div className={styles.container}>
              <div className={styles.effects}>
              {settings &&
                settings.map((effect, index) => {
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
                    case "ping pong delay":
                      return (
                        <PingPongDelay
                          key={index}
                          index={index}
                          engine={engine}
                          settings={settings}
                          updateSettings={updateSettings}
                        />
                      );
                      case "distortion":
                        return (
                          <Distortion
                            key={index}
                            index={index}
                            engine={engine}
                            settings={settings}
                            updateSettings={updateSettings}
                          />
                        )
                        case "chorus":
                          return (
                            <Chorus
                              key={index}
                              index={index}
                              engine={engine}
                              settings={settings}
                              updateSettings={updateSettings}
                            />
                          )

                    default:
                      return null;
                  }
                })}</div>
              <div
                onClick={() => setIsAddEffectOpen(!isAddEffectOpen)}
                className={styles.add_effect}
              >
                <IconPlus stroke={1} size={40} />
                <span>Add Effect</span>
              </div>
            </div>
          </>
        )}
      </SectionWrapper>
    </div>
  );
};
