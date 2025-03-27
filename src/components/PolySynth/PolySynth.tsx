"use client";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone/build/esm/index";
import styles from "./PolySynth.module.css";
import { Preset } from "@/lib/types/types";
import { Oscillator } from "../Oscillator/Oscillator";
import { Noise } from "../Noise/Noise";
import { Filter } from "../Filter/Filter";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { EnvelopeAmplitude } from "../EnvelopeAmplitude/EnvelopeAmplitude";
import { LFO } from "../LFO/LFO";
import CustomEffects from "@/lib/engines/CustomEffects";
import { Header } from "../Header/Header";
import { motion, AnimatePresence } from "framer-motion";
import { Effects } from "../Effects/Effects";
import { Keyboard } from "../Keyboard/Keyboard";
import { useUiStore } from "@/lib/store/uiStore";
import {
  useEffectsEngineStore,
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { MiscParameters } from "../MiscParameters/MiscParameters";
import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";

type PolySynthProps = {
  currentPreset: Preset;
};

const PolySynth = () => {
  const [enginesReady, setEnginesReady] = useState<boolean>(false);

  const { currentPreset, setCurrentPreset } = usePresetLibraryStore(
    (state) => ({
      currentPreset: state.currentPreset,
      setCurrentPreset: state.setCurrentPreset,
    })
  );

  const { uiSize } = useUiStore((state) => ({
    uiSize: state.uiSize,
  }));
  const effectsRef = useRef<CustomEffects>();
  const polySynthRef = useRef<CustomPolySynth>();
  const waveformRef = useRef<Tone.Waveform>();
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

  const { presetLibrary, setPresetLibrary, selectedPreset, setSelectedPreset } =
    usePresetLibraryStore((state) => ({
      selectedPreset: state.selectedPreset,
      presetLibrary: state.presetLibrary,
      setPresetLibrary: state.setPresetLibrary,
      setSelectedPreset: state.setSelectedPreset,
    }));

  const { setAllParamsFromPreset } = useSynthSettingsStore((state) => ({
    setAllParamsFromPreset: state.setAllParamsFromPreset,
  }));
  // misc
  const [panSpread, setPanSpread] = useState<number>(0);
  const [unison, setUnison] = useState<boolean>(false);

  // fetch presets
  async function fetchPresets() {
    const response = await fetch("/api/presets", { method: "GET" });
    const data = await response.json();
    setPresetLibrary(data);
  }

  useEffect(() => {
    fetchPresets();
  }, []);

  useEffect(() => {
    const defaultPreset = presetLibrary.find((p) => p.default === true);
    if (defaultPreset) {
      setCurrentPreset(defaultPreset.settings);
      setAllParamsFromPreset(defaultPreset.settings);
      setSelectedPreset(defaultPreset.id);
    }
  }, [presetLibrary]);

  // initialize synth
  useEffect(() => {
    if (currentPreset) {
      if (polySynthRef.current) {
        polySynthRef.current.dispose();
      }

      if (effectsRef.current) {
        effectsRef.current.dispose();
      }

      polySynthRef.current = new CustomPolySynth(currentPreset);
      effectsRef.current = new CustomEffects(
        polySynthRef.current.outputNode,
        currentPreset.effects
      );
      const masterNode = new Tone.Gain().chain(
        effectsRef.current.outputNode,
        Tone.Destination
      );

      waveformRef.current = new Tone.Waveform(32);
      waveformRef.current.connect(masterNode);

      setPolySynth(polySynthRef.current);
      setEffects(effectsRef.current);
      setEnginesReady(true);
    }
  }, [currentPreset, setPolySynth, setEffects]);

  return (
    <div
      className={styles.wrapper}
      style={
        {
          "--font-size": `${uiSize}em`,
        } as React.CSSProperties
      }
      
    >
      {enginesReady && (
        <>
          <Header />
          <AnimatePresence>
            {isUiVisible && (
              <div
                className={styles.container}
                key="ui-visible"
                style={{
                  paddingBottom: isKeyboardOpen || isFxOpen ? "22em" : "0em",
                }}
              >
                <motion.div
                  className={styles.left}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <div className={styles.osc1}>
                    <Oscillator oscNumber={1} />
                  </div>
                  <div className={styles.osc2}>
                    <Oscillator oscNumber={2} />
                  </div>
                  <div className={styles.noise}>
                    <Noise />
                  </div>
                  <div className={styles.misc}>
                    <MiscParameters />
                  </div>
                </motion.div>
                <motion.div
                  className={styles.right}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <div className={styles.filter}>
                    <Filter />
                  </div>
                  <div className={styles.envelope}>
                    <EnvelopeAmplitude />
                  </div>
                  <div className={styles.lfo1}>
                    <LFO lfoNumber={1} />
                  </div>
                  <div className={styles.lfo2}>
                    <LFO lfoNumber={2} />
                  </div>
                </motion.div>
              </div>
            )}
            <motion.div
              key="ui-hidden"
              className={styles.bottom}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, y: 100 }}
            >
              {isFxOpen && <Effects />}
              {isKeyboardOpen && <Keyboard />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default PolySynth;
