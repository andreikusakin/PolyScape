"use client";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone/build/esm/index";
import styles from "./PolySynth.module.css";
import { Effect, LFOTarget, Preset } from "@/lib/types/types";
import Oscillator from "../Oscillator/Oscillator";
import Noise from "../Noise/Noise";
import { Filter } from "../Filter/Filter";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { EnvelopeAmplitude } from "../EnvelopeAmplitude/EnvelopeAmplitude";
import { LFO } from "../LFO/LFO";
import CustomEffects from "@/lib/engines/CustomEffects";
import { Header } from "../Header/Header";
import { WebMidi } from "webmidi";
import { motion, AnimatePresence } from "framer-motion";
import { Effects } from "../Effects/Effects";
import { Keyboard } from "../Keyboard/Keyboard";
import { useUiStore } from "@/lib/store/uiStore";
import {
  useEffectsEngineStore,
  useSynthEngineStore,
} from "@/lib/store/settingsStore";
import { MiscParameters } from "../MiscParameters/MiscParameters";

type PolySynthProps = {
  preset: Preset;
};

const PolySynth = ({ preset }: PolySynthProps) => {
  const [enginesReady, setEnginesReady] = useState<boolean>(false);

  // const polySynthRef = useRef<CustomPolySynth>();
  const effectsRef = useRef<CustomEffects>();
  const { isKeyboardOpen, isFxOpen, isUiVisible } = useUiStore((state) => ({
    isKeyboardOpen: state.isKeyboardOpen,
    isFxOpen: state.isFxOpen,
    isUiVisible: state.isUiVisible,
  }));
  const { polySynth, setPolySynth } = useSynthEngineStore((state) => ({
    polySynth: state.synthEngine,
    setPolySynth: state.setSynthEngine,
  }));

  const { effects, setEffects } = useEffectsEngineStore((state) => ({
    effects: state.effectsEngine,
    setEffects: state.setEffectsEngine,
  }));


  // misc
  const [panSpread, setPanSpread] = useState<number>(0);
  const [unison, setUnison] = useState<boolean>(false);


  

  // initialize synth
  useEffect(() => {
    const polySynthRef = new CustomPolySynth(preset);
    effectsRef.current = new CustomEffects(
      polySynthRef.outputNode,
      preset.effects
    );
    // loadPreset(preset);
    const masterNode = new Tone.Gain().chain(
      effectsRef.current.outputNode,
      Tone.Destination
    );
    console.log(polySynthRef, effectsRef.current);
    setPolySynth(polySynthRef);
    setEffects(effectsRef.current);
    setEnginesReady(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      {enginesReady && (
        <>
          <Header />
          <AnimatePresence>
            {isUiVisible && (
              <>
                <div className={styles.left_right}>
                  <motion.div
                    className={styles.left}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <Oscillator oscNumber={1} />
                    <Oscillator oscNumber={2} />
                    <Noise />
                    <MiscParameters />
                  </motion.div>
                  <motion.div
                    className={styles.right}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, x: 100 }}
                  >
                    <Filter />
                    <EnvelopeAmplitude />
                    <LFO lfoNumber={1} />
                    <LFO lfoNumber={2} />
                  </motion.div>
                </div>
                <motion.div
                  className={styles.bottom}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: 100 }}
                >
                  <div className={styles.LFOs}></div>
                </motion.div>
                {isFxOpen && <Effects />}
                <div className={`${isKeyboardOpen ? "flex" : "hidden"}`}>
                  <Keyboard />
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default PolySynth;
