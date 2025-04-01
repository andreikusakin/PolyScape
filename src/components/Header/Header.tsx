import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Header.module.css";
import { WebMidi } from "webmidi";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/store/uiStore";
import { useSynthEngineStore } from "@/lib/store/settingsStore";
import { PresetLibrary } from "../PresetLibrary/PresetLibrary";
import { IconDownload } from "@tabler/icons-react";
import { Modal } from "../Modal/Modal";
import { SavePreset } from "../SavePreset/SavePreset";
import { useShallow } from "zustand/react/shallow";
import { IconAdjustments } from "@tabler/icons-react";
import { GlobalSettings } from "../GlobalSettings/GlobalSettings";
import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";
import React from "react";

export const Header = React.memo(() => {
  const { engine } = useSynthEngineStore((state) => ({
    engine: state.synthEngine,
  }));
  const [midiInputs, setMidiInputs] = useState<typeof WebMidi.inputs>([]);
  const [currentMidiDevice, setCurrentMidiDevice] = useState(
    "no midi devices detected"
  );
  const [isMidiSupported, setIsMidiSupported] = useState<boolean>(false);
  const [isSelectingMidi, setIsSelectingMidi] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPresetLibraryOpen, setIsPresetLibraryOpen] =
    useState<boolean>(false);
  const [isSavePresetOpen, setIsSavePresetOpen] = useState<boolean>(false);

  const presets = usePresetLibraryStore(
    useShallow((state) => state.presetLibrary)
  );
  const selectedPreset = usePresetLibraryStore(
    useShallow((state) => state.selectedPreset)
  );

  const {
    isKeyboardOpen,
    isFxOpen,
    isUiVisible,
    toggleKeyboardOpen,
    toggleFxOpen,
    toggleUiVisible,
  } = useUiStore(
    useShallow((state) => ({
      isKeyboardOpen: state.isKeyboardOpen,
      isFxOpen: state.isFxOpen,
      isUiVisible: state.isUiVisible,
      isSavePresetOpen: state.isSavePresetOpen,
      toggleSavePresetOpen: state.toggleSavePresetOpen,
      toggleKeyboardOpen: state.toggleKeyboardOpen,
      toggleFxOpen: state.toggleFxOpen,
      toggleUiVisible: state.toggleUiVisible,
    }))
  );

  // useEffect(() => {
  //   if (WebMidi.enabled) {
  //     setMidiInputs(WebMidi.inputs);
  //     if (WebMidi.inputs.length > 0) {
  //       setCurrentMidiDevice(WebMidi.inputs[engine?.midiInputIndex]?.name);
  //     }
  //   }
  //   setIsMidiSupported(engine?.isMidiSupported);
  // }, []);

  useEffect(() => {
    const checkMidi = () => {
      if (WebMidi.enabled) {
        setMidiInputs(WebMidi.inputs);
        if (WebMidi.inputs.length > 0 && engine?.midiInputIndex !== undefined) {
          setCurrentMidiDevice(WebMidi.inputs[engine.midiInputIndex]?.name);
        }
        setIsMidiSupported(true);
        return true;
      }
      setIsMidiSupported(false);
      return false;
    };

    if (!checkMidi()) {
      const intervalId = setInterval(() => {
        if (checkMidi()) {
          clearInterval(intervalId);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [engine?.midiInputIndex]);

  const hideUiAnimation = {
    width: isUiVisible ? "100%" : "fit-content",
  };

  return (
    <motion.header
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
                {!engine?.isMidiSupported && (
                  <button disabled
                    className={[
                      styles.midi_selector,
                      styles.no_midi_support,
                    ].join(" ")}
                  >
                    Midi is not supported
                  </button>
                )}
                {engine?.isMidiSupported && midiInputs && (
                  <button
                    className={styles.midi_selector}
                    onClick={() => setIsSelectingMidi(!isSelectingMidi)}
                  >
                    <label>{currentMidiDevice}</label>
                    {isSelectingMidi && midiInputs.length !== 0 && (
                      <div className={styles.selecting_midi}>
                        {midiInputs.map((input, i) => {
                          if (!input) return null;
                          return (
                            <div
                              key={i}
                              onClick={() => engine?.setMidiInputByIndex(i)}
                            >
                              {input.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </button>
                )}
              </div>
              <div className={styles.preset}>
                <span>preset</span>
                <button
                  onClick={() => setIsPresetLibraryOpen(!isPresetLibraryOpen)}
                  className={`${styles.preset_name} ${styles.header_button}`}
                >
                  <span>
                    {presets &&
                      presets.find((p) => p.id === selectedPreset)?.name}
                  </span>
                </button>
                <button
                  onClick={() => setIsSavePresetOpen(!isSavePresetOpen)}
                  className={`${styles.header_button} ${styles.icon_button}`}
                >
                  <IconDownload stroke={1} size={24} />
                </button>

                {isPresetLibraryOpen && <PresetLibrary />}
              </div>
              {/* <div className={styles.bpm}>
                <span>bpm</span>
              </div> */}
              {/* <div className={styles.master_volume}>
                <Knob
                  radius={10}
                  minValue={-70}
                  maxValue={12}
                  currentValue={0}
                  interactive
                />
              </div> */}

              <div className={styles.buttons}>
                <button
                  className={`${styles.header_button} ${
                    isKeyboardOpen && styles.selected
                  } ${styles.icon_button}`}
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
                <div>
                  <button
                    className={`${styles.header_button} ${styles.icon_button} ${
                      isSettingsOpen && styles.selected
                    }`}
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    <IconAdjustments stroke={1} size={24} />
                  </button>
                  {isSettingsOpen && <GlobalSettings />}
                </div>
                <button
                  onClick={toggleUiVisible}
                  className={styles.header_button}
                >
                  hide ui
                </button>
              </div>
            </motion.div>
          )}
          {!isUiVisible && (
            <motion.div
              className={`${styles.container} ${styles.hide_ui_container}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <button
                className={`${styles.header_button} ${
                  isKeyboardOpen && styles.selected
                } ${styles.icon_button}`}
                onClick={toggleKeyboardOpen}
              >
                <img src="/piano_keyboard.svg" alt="keyboard icon" />
              </button>
              <motion.button
                className={styles.header_button}
                onClick={toggleUiVisible}
              >
                show ui
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionWrapper>

      {isSavePresetOpen && (
        <Modal>
          <SavePreset setIsOpen={setIsSavePresetOpen} />
        </Modal>
      )}
    </motion.header>
  );
});
