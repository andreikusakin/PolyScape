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

type PolySynthProps = {
  preset: Preset;
};

const PolySynth = ({ preset }: PolySynthProps) => {
  const [enginesReady, setEnginesReady] = useState<boolean>(false);
  // const [uiSettings, setUiSettings] = useState({
  //   isKeyboardOpen: true,
  //   isFxOpen: false,
  //   isUiVisible: true,
  // });

  const {isKeyboardOpen, isFxOpen, isUiVisible} = useUiStore(
    (state) => ({
      isKeyboardOpen: state.isKeyboardOpen,
      isFxOpen: state.isFxOpen,
      isUiVisible: state.isUiVisible,
    })
  );
  const polySynth = useRef<CustomPolySynth>();
  const effects = useRef<CustomEffects>();
  const [isSelectingLFOTarget, setIsSelectingLFOTarget] = useState<
    false | 1 | 2
  >(false);

  const [osc1Settings, setOsc1Settings] = useState(preset.osc1);
  const [osc2Settings, setOsc2Settings] = useState(preset.osc2);
  const [noiseSettings, setNoiseSettings] = useState(preset.noise);
  const [filterSettings, setFilterSettings] = useState(preset.filter);

  // envelope amplitude
  const [envelopeSettings, setEnvelopeSettings] = useState(preset.envelope);
  const [filterEnvelopeSettings, setFilterEnvelopeSettings] = useState(
    preset.filterEnvelope
  );

  const [fxSettings, setFxSettings] = useState<Effect[]>(preset.effects || []);
  console.log(fxSettings);

  // misc
  const [panSpread, setPanSpread] = useState<number>(0);
  const [unison, setUnison] = useState<boolean>(false);

  //LFO1
  const [LFO1Type, setLFO1Type] = useState<
    "sine" | "triangle" | "sawtooth" | "square"
  >("sine");
  const [LFO1Rate, setLFO1Rate] = useState<
    Tone.Unit.Frequency | Tone.FrequencyClass
  >(0);
  const [LFO1Sync, setLFO1Sync] = useState<boolean>(false);
  // const [LFO1Amount, setLFO1Amount] = useState<Tone.Unit.NormalRange>(0);
  const [LFO1Destinations, setLFO1Destinations] = useState<[]>([]);

  //LFO2
  const [LFO2Type, setLFO2Type] = useState<
    "sine" | "triangle" | "sawtooth" | "square"
  >("sine");
  const [LFO2Rate, setLFO2Rate] = useState<
    Tone.Unit.Frequency | Tone.FrequencyClass
  >(0);
  const [LFO2Sync, setLFO2Sync] = useState<boolean>(false);
  // const [LFO2Amount, setLFO2Amount] = useState<Tone.Unit.NormalRange>();
  const [LFO2Destinations, setLFO2Destinations] = useState<[]>([]);

  console.log(LFO1Sync, LFO1Rate);
  WebMidi.enable();

  function loadPreset(preset: Preset) {
    // OSC1
    // Filter
  }

  const assignLFO = (target: LFOTarget, lfo: 1 | 2, currentValue?: number) => {
    const currentRate = lfo === 1 ? LFO1Rate : LFO2Rate;
    setIsSelectingLFOTarget(false);
    const targetExistsInLFO1 = polySynth.current?.LFO1.some(
      (lfo) => lfo.target === target
    );
    const targetExistsInLFO2 = polySynth.current?.LFO2.some(
      (lfo) => lfo.target === target
    );
    if (targetExistsInLFO1 && lfo === 1) {
      return;
    }
    if (targetExistsInLFO2 && lfo === 2) {
      return;
    }

    polySynth.current?.setLFO(target, lfo, currentValue, currentRate);
    if (lfo === 1) {
      setLFO1Destinations([
        ...LFO1Destinations,
        { target: target, amount: 0.5 },
      ]);
    } else {
      setLFO2Destinations([
        ...LFO2Destinations,
        { target: target, amount: 0.5 },
      ]);
    }
  };

  function addNewEffect(type: string) {
    const newEffect = {
      type: type,
      settings: { wet: 50 },
    };
    setFxSettings([...fxSettings, newEffect]);
    effects.current?.addEffect(type);
  }

  // initialize synth
  useEffect(() => {
    polySynth.current = new CustomPolySynth(preset);
    effects.current = new CustomEffects(
      polySynth.current.outputNode,
      preset.effects
    );
    loadPreset(preset);
    const masterNode = new Tone.Gain().chain(
      effects.current.outputNode,
      Tone.Destination
    );
    console.log(polySynth.current, effects.current);
    setEnginesReady(true);
  }, []);

  // // update fx

  // useEffect(() => {
  //   const panValue = panSpread ?? 0;
  //   polySynth.current?.setPanSpreadEngine(panValue);
  //   console.log("panSpread changed to: ", panValue);
  // }, [panSpread]);

  useEffect(() => {
    const unisonValue = unison ?? false;
    if (polySynth.current) {
      polySynth.current.unison = unisonValue;
    }
  }, [unison]);

  return (
    <div className={styles.wrapper}>
      {enginesReady && (
        <>
          <Header
            engine={polySynth.current}
          />
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
                    <Oscillator
                      engine={polySynth.current}
                      name={"osc1"}
                      settings={osc1Settings}
                      updateSettings={setOsc1Settings}
                      isSelectingLFO={isSelectingLFOTarget}
                      assignLFO={assignLFO}
                    />
                    <Oscillator
                      engine={polySynth.current}
                      name={"osc2"}
                      settings={osc2Settings}
                      updateSettings={setOsc2Settings}
                      isSelectingLFO={isSelectingLFOTarget}
                      assignLFO={assignLFO}
                    />
                    <Noise
                      engine={polySynth.current}
                     
                      isSelectingLFO={isSelectingLFOTarget}
                      assignLFO={assignLFO}
                    />
                  </motion.div>
                  <motion.div
                    className={styles.right}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, x: 100 }}
                  >
                    <Filter
                      engine={polySynth.current}
                      name={"filter"}
                      settings={filterSettings}
                      updateSettings={setFilterSettings}
                      envSettings={filterEnvelopeSettings}
                      updateEnvSettings={setFilterEnvelopeSettings}
                    />
                    <EnvelopeAmplitude
                      
                      engine={polySynth.current}
                     
                    />
                    <LFO
                      engine={polySynth.current}
                      lfoNumber={1}
                      type={LFO1Type}
                      setType={setLFO1Type}
                      rate={LFO1Rate}
                      setRate={setLFO1Rate}
                      sync={LFO1Sync}
                      setSync={setLFO1Sync}
                      destinations={LFO1Destinations}
                      setDestinations={setLFO1Destinations}
                      setIsSelecting={setIsSelectingLFOTarget}
                    />
                    <LFO
                      engine={polySynth.current}
                      lfoNumber={2}
                      type={LFO2Type}
                      setType={setLFO2Type}
                      rate={LFO2Rate}
                      setRate={setLFO2Rate}
                      sync={LFO2Sync}
                      setSync={setLFO2Sync}
                      destinations={LFO2Destinations}
                      setDestinations={setLFO2Destinations}
                      setIsSelecting={setIsSelectingLFOTarget}
                    />
                  </motion.div>
                </div>
                <motion.div
                  className={styles.bottom}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: 100 }}
                >
                  <div className={styles.LFOs}>
                    
                  </div>
                </motion.div>
                {isFxOpen && (
                  <Effects
                    settings={fxSettings}
                    updateSettings={setFxSettings}
                    engine={effects.current}
                  />
                )}
                <div
                  className={`${isKeyboardOpen ? "flex" : "hidden"}`}
                >
                  <Keyboard
                    engine={polySynth.current}
                    osc1Type={osc1Settings.type}
                    osc2Type={osc2Settings.type}
                  />
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
