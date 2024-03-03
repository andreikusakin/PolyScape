import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Header.module.css";
import { WebMidi } from "webmidi";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { UiSettings } from "@/lib/types/types";
import { useUiStore } from "@/lib/store/uiStore";
import { useSynthEngineStore } from "@/lib/store/settingsStore";
import { PresetLibrary } from "../PresetLibrary/PresetLibrary";
import Knob from "../Knob/Knob";

export const Header = () => {
  const { engine } = useSynthEngineStore((state) => ({
    engine: state.synthEngine,
  }));
  const [midiInputs, setMidiInputs] = useState<typeof WebMidi.inputs>([]);
  const [currentMidiDevice, setCurrentMidiDevice] = useState(
    "no midi devices detected"
  );
  const [isMidiSupported, setIsMidiSupported] = useState<boolean>(false);
  const [isSelectingMidi, setIsSelectingMidi] = useState<boolean>(false);

  const {
    isKeyboardOpen,
    isFxOpen,
    isUiVisible,
    toggleKeyboardOpen,
    toggleFxOpen,
    toggleUiVisible,
  } = useUiStore((state) => ({
    isKeyboardOpen: state.isKeyboardOpen,
    isFxOpen: state.isFxOpen,
    isUiVisible: state.isUiVisible,
    toggleKeyboardOpen: state.toggleKeyboardOpen,
    toggleFxOpen: state.toggleFxOpen,
    toggleUiVisible: state.toggleUiVisible,
  }));

  // const handleKeyboardOpen = () => {
  //   setUiSettings({
  //     ...uiSettings,
  //     isKeyboardOpen: !isKeyboardOpen,
  //     isFxOpen: isKeyboardOpen ? isFxOpen : false,
  //   });
  // };

  // const handleFxOpen = () => {
  //   setUiSettings({
  //     ...uiSettings,
  //     isFxOpen: !isFxOpen,
  //     isKeyboardOpen: isFxOpen ? isKeyboardOpen : false,
  //   });
  // };

  useEffect(() => {
    if (WebMidi.enabled) {
      setMidiInputs(WebMidi.inputs);
      if (WebMidi.inputs.length > 0) {
        setCurrentMidiDevice(WebMidi.inputs[engine?.midiInputIndex]?.name);
      }
      console.log(WebMidi.enabled);
    }
    setIsMidiSupported(engine?.isMidiSupported);
  }, []);

  const hideUiAnimation = {
    width: isUiVisible ? "100%" : "fit-content",
  };

  return (
    <motion.div
      className={styles.wrapper}
      animate={hideUiAnimation}
      transition={{ duration: 0.5 }}
    >
      <SectionWrapper>
        <AnimatePresence>
          {isUiVisible && (
            <motion.div
              className={styles.container}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.midi}>
                <span>Midi</span>
                {!isMidiSupported && !midiInputs && (
                  <div
                    className={[
                      styles.midi_selector,
                      styles.no_midi_support,
                    ].join(" ")}
                  >
                    No Midi Support in Your Browser
                  </div>
                )}
                {midiInputs && (
                  <div
                    className={styles.midi_selector}
                    onClick={() => setIsSelectingMidi(!isSelectingMidi)}
                  >
                    <label>{currentMidiDevice}</label>
                    {isSelectingMidi && midiInputs.length !== 0 && (
                      <div className={styles.selecting_midi}>
                        {midiInputs.map((input, i) => (
                          <div
                            key={i}
                            onClick={() => engine?.setMidiInputByIndex(i)}
                          >
                            {input.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.preset}>
                <span>preset</span>
                <PresetLibrary />
              </div>
              <div className={styles.bpm}>bpm</div>
              <div className={styles.master_volume}><Knob 
                            radius={10}
                            minValue={-70}
                            maxValue={12}
                            currentValue={0}
                            interactive
                          /></div>
                          
              <div className={styles.buttons}>
                
                <button
                  className={`${styles.keyboard_button} ${
                    isKeyboardOpen && styles.selected
                  }`}
                  onClick={toggleKeyboardOpen}
                >
                  <img src="/piano_keyboard.svg" alt="keyboard icon" />
                </button>
                <button
                  className={`${styles.header_button} ${
                    isFxOpen && styles.selected
                  }`}
                  onClick={toggleFxOpen}
                >
                  fx
                </button>

                <button
                  className={styles.header_button}
                  onClick={toggleUiVisible}
                >
                  hide ui
                </button>
              </div>
            </motion.div>
          )}
          {!isUiVisible && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              exit={{ opacity: 0 }}
              className={[styles.header_button, styles.show_ui].join(" ")}
              onClick={toggleUiVisible}
            >
              show ui
            </motion.button>
          )}
        </AnimatePresence>
      </SectionWrapper>
    </motion.div>
  );
};
