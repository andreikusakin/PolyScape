import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Header.module.css";
import { WebMidi } from "webmidi";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HeaderProps = {
  engine: CustomPolySynth;
  isUiVisible: boolean;
  setIsUiVisible: (isUiVisible: boolean) => void;
};

export const Header = ({
  engine,
  isUiVisible,
  setIsUiVisible,
}: HeaderProps) => {

  const [midiInputs, setMidiInputs] = useState<typeof WebMidi.inputs>([]);
  const [currentMidiDevice, setCurrentMidiDevice] = useState("no midi devices detected");
  const [isMidiSupported, setIsMidiSupported] = useState<boolean>(false);
  const [isSelectingMidi, setIsSelectingMidi] = useState<boolean>(false);
  useEffect(() => {
    if (WebMidi.enabled) {
      
      setMidiInputs(WebMidi.inputs);
      if (WebMidi.inputs.length > 0) {
        setCurrentMidiDevice(WebMidi.inputs[engine?.midiInputIndex]?.name);
      }
      console.log(WebMidi.enabled);
    }
    setIsMidiSupported(engine?.isMidiSupported);
  }, [engine]);

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
              <div className={styles.preset}>preset</div>
              <div className={styles.bpm}>bpm</div>

              <div className={styles.buttons}>
              <button className={styles.header_button}>synth</button>
                <button className={styles.header_button}>fx</button>

                <button
                  className={styles.header_button}
                  onClick={() => setIsUiVisible(!isUiVisible)}
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
              onClick={() => setIsUiVisible(!isUiVisible)}
            >
              show ui
            </motion.button>
          )}
        </AnimatePresence>
      </SectionWrapper>
    </motion.div>
  );
};
