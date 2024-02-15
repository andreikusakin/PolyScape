"use-client";
import { useState, useEffect, useRef, use } from "react";
import * as Tone from "tone/build/esm/index";

import { LFOTarget, Preset } from "@/lib/types/types";
import Knob from "./Knob/Knob";
import Oscillator from "./Oscillator/Oscillator";
import Noise from "./Noise/Noise";
import { Filter } from "./Filter/Filter";
import { CustomVoice } from "@/lib/engines/CustomVoice";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { Envelope } from "./Envelope/Envelope";
import { LFO } from "./LFO/LFO";

const initPreset: Preset = {
  osc1: {
    type: "sawtooth",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  osc2: {
    type: "triangle",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: -40,
  },
  noise: {
    type: "white",
    volume: -70,
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.01,
  },
  filter: { type: "lowpass", frequency: 0, rolloff: -12, Q: 0.01 },
  filterEnvelope: {
    attack: 0,
    decay: 0.01,
    sustain: 0,
    release: 0,
    baseFrequency: 15000,
    octaves: 0,
    exponent: 5,
  },
  unison: false,
  panSpread: 0,
  volume: 0,
  LFO1: {
    type: "sine",
    rate: "4n",
    sync: false,
    destinations: [
      // { target: "osc1 fine", amount: 0.1 },
      // { target: "osc1 volume", amount: 1 },
      // { target: "filter cutoff", amount: 0.1 },
      // { target: "osc1 pulse width", amount: 0.01 },
    ],
  },
};

const PolySynth = () => {
  const [preset, setPreset] = useState<Preset>(initPreset);
  const [currestSettings, setCurrentSettings] = useState<Preset>(initPreset);
  const polySynth = useRef<CustomPolySynth>();
  const [isSelectingLFOTarget, setIsSelectingLFOTarget] = useState<
    false | 1 | 2
  >(false);

  // OSC1
  const [osc1type, setOsc1Type] = useState<
    "sawtooth" | "sine" | "pulse" | "triangle"
  >("sine");
  const [osc1Fine, setOsc1Fine] = useState<number>(0);
  const [osc1Coarse, setosc1Coarse] = useState<number>(0);
  const [osc1PulseWidth, setOsc1PulseWidth] = useState<number>(0);
  const [osc1Volume, setOsc1Volume] = useState<number>(0);

  // OSC2
  const [oscillator2Type, setOscillator2Type] = useState<
    "sawtooth" | "sine" | "pulse" | "triangle"
  >("sine");
  const [osc2Fine, setOsc2Fine] = useState<number>(0);
  const [osc2Transpose, setOsc2Transpose] = useState<number>(0);
  const [osc2PulseWidth, setOsc2PulseWidth] = useState<number>(0);
  const [osc2Volume, setOsc2Volume] = useState<number>(0);

  // Noise

  const [noiseType, setNoiseType] = useState<"white" | "pink" | "brown">(
    "white"
  );
  const [noiseVolume, setNoiseVolume] = useState<number>(0);

  // envelope amplitude
  const [attack, setAttack] = useState<number>(0);
  const [decay, setDecay] = useState<number>(0);
  const [sustain, setSustain] = useState<number>(0);
  const [release, setRelease] = useState<number>(0);

  // filter
  const [filterType, setFilterType] = useState<
    "lowpass" | "highpass" | "bandpass" | "notch"
  >("lowpass");
  const [filterFrequency, setFilterFrequency] = useState<number>(0);
  const [filterRolloff, setFilterRolloff] = useState<Tone.FilterRollOff>(-12);
  const [filterQ, setFilterQ] = useState<number>(0);

  const [filterEnvelopeAttack, setFilterEnvelopeAttack] = useState<number>(0);
  const [filterEnvelopeDecay, setFilterEnvelopeDecay] = useState<number>(0);
  const [filterEnvelopeSustain, setFilterEnvelopeSustain] = useState<number>(0);
  const [filterEnvelopeRelease, setFilterEnvelopeRelease] = useState<number>(0);
  const [filterEnvelopeBaseFrequency, setFilterEnvelopeBaseFrequency] =
    useState<number>(0);
  const [filterEnvelopeOctaves, setFilterEnvelopeOctaves] = useState<number>(0);
  const [filterEnvelopeExponent, setFilterEnvelopeExponent] =
    useState<number>(0);

  // fx
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

  function loadPreset(preset: Preset) {
    // OSC1
    setOsc1Type(preset.osc1.type);
    setOsc1Fine(preset.osc1.detune);
    setosc1Coarse(preset.osc1.transpose);
    setOsc1PulseWidth(preset.osc1.pulseWidth);

    setOsc1Volume(preset.osc1.volume);
    // OSC2
    setOscillator2Type(preset.osc2.type);
    setOsc2Fine(preset.osc2.detune);
    setOsc2Transpose(preset.osc2.transpose);
    setOsc2PulseWidth(preset.osc2.pulseWidth);
    setOsc2Volume(preset.osc2.volume);
    // Noise
    setNoiseType(preset.noise.type);
    setNoiseVolume(preset.noise.volume);
    // Envelope
    setAttack(preset.envelope.attack);
    setDecay(preset.envelope.decay);
    setSustain(preset.envelope.sustain);
    setRelease(preset.envelope.release);
    // Filter
    setFilterType(preset.filter.type);
    setFilterFrequency(preset.filter.frequency);
    setFilterRolloff(preset.filter.rolloff);
    setFilterQ(preset.filter.Q);
    // Filter Envelope
    setFilterEnvelopeAttack(preset.filterEnvelope.attack);
    setFilterEnvelopeDecay(preset.filterEnvelope.decay);
    setFilterEnvelopeSustain(preset.filterEnvelope.sustain);
    setFilterEnvelopeRelease(preset.filterEnvelope.release);
    setFilterEnvelopeBaseFrequency(preset.filterEnvelope.baseFrequency);
    setFilterEnvelopeOctaves(preset.filterEnvelope.octaves);
    setFilterEnvelopeExponent(preset.filterEnvelope.exponent);
    // FX
    setPanSpread(preset.panSpread);
    setUnison(preset.unison);
    // LFO1
    setLFO1Type(preset.LFO1?.type || "sine");
    setLFO1Rate(preset.LFO1?.rate || 1);
    setLFO1Sync(preset.LFO1?.sync || false);
    setLFO1Destinations(preset.LFO1?.destinations);
  }

  const assignLFO = (target: LFOTarget, lfo: 1 | 2, currentValue?: number) => {
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

    polySynth.current?.setLFO(target, lfo, currentValue);
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

  // initialize synth
  useEffect(() => {
    const gainNode = new Tone.Gain({
      gain: 0.06,
      units: "gain",
    }).toDestination();

    polySynth.current = new CustomPolySynth(gainNode, initPreset);
    loadPreset(preset);

    // polySynth.current.setLFO("osc1Coarse", 1);
    // polySynth.current.setLFO("osc1 fine", 1);
  }, [preset]);

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

  // LFO1

  // useEffect(() => {
  //   if (LFO1Destinations) {
  //     LFO1Destinations.forEach((destination) => {
  //       polySynth.current?.setLFO(destination.target, 1);
  //     });
  //   }
  // }, [LFO1Destinations]);

  // useEffect(() => {
  //   if (LFO1Type) {
  //     polySynth.current?.LFO1.forEach((lfo) => {
  //       lfo.LFO.set({ type: LFO1Type });
  //     });
  //   }
  // }, [LFO1Type]);

  // useEffect(() => {
  //   if (LFO1Rate) {
  //     polySynth.current?.LFO1.forEach((lfo) => {
  //       lfo.LFO.set({ frequency: LFO1Rate });
  //     });
  //   }
  // }, [LFO1Rate]);

  return (
    <div className="flex w-full h-full gap-10 ">
      <div>
        <Oscillator
          engine={polySynth.current}
          name={"osc1"}
          oscType={osc1type}
          setOscillatorType={setOsc1Type}
          coarse={osc1Coarse}
          setCoarse={setosc1Coarse}
          detune={osc1Fine}
          setDetune={setOsc1Fine}
          pulseWidth={osc1PulseWidth}
          setPulseWidth={setOsc1PulseWidth}
          volume={osc1Volume}
          setVolume={setOsc1Volume}
          lfo1={LFO1Destinations}
          lfo2={LFO2Destinations}
          isSelectingLFO={isSelectingLFOTarget}
          assignLFO={assignLFO}
        />
        <Oscillator
          engine={polySynth.current}
          name={"osc2"}
          oscType={oscillator2Type}
          setOscillatorType={setOscillator2Type}
          coarse={osc2Transpose}
          setCoarse={setOsc2Transpose}
          detune={osc2Fine}
          setDetune={setOsc2Fine}
          pulseWidth={osc2PulseWidth}
          setPulseWidth={setOsc2PulseWidth}
          volume={osc2Volume}
          setVolume={setOsc2Volume}
          isSelectingLFO={isSelectingLFOTarget}
          assignLFO={assignLFO}
        />
        <Noise
          engine={polySynth.current}
          name={"noise"}
          type={noiseType}
          setType={setNoiseType}
          volume={noiseVolume}
          setVolume={setNoiseVolume}
          isSelectingLFO={isSelectingLFOTarget}
          assignLFO={assignLFO}
        />
      </div>
      <div>
        <Filter
          engine={polySynth.current}
          name={"filter"}
          filterType={filterType}
          setFilterType={setFilterType}
          frequency={filterEnvelopeBaseFrequency}
          setFrequency={setFilterEnvelopeBaseFrequency}
          rolloff={filterRolloff}
          setRolloff={setFilterRolloff}
          resonance={filterQ}
          setResonance={setFilterQ}
          envAmount={filterEnvelopeOctaves}
          setEnvAmount={setFilterEnvelopeOctaves}
          attack={filterEnvelopeAttack}
          setAttack={setFilterEnvelopeAttack}
          decay={filterEnvelopeDecay}
          setDecay={setFilterEnvelopeDecay}
          sustain={filterEnvelopeSustain}
          setSustain={setFilterEnvelopeSustain}
          release={filterEnvelopeRelease}
          setRelease={setFilterEnvelopeRelease}
        />
        <Envelope
          engine={polySynth.current}
          name={"amplitude"}
          attack={attack}
          setAttack={setAttack}
          decay={decay}
          setDecay={setDecay}
          sustain={sustain}
          setSustain={setSustain}
          release={release}
          setRelease={setRelease}
        />
        <LFO
          engine={polySynth.current}
          name={"lfo1"}
          type={LFO1Type}
          setType={setLFO1Type}
          rate={LFO1Rate}
          setRate={setLFO1Rate}
          sync={LFO1Sync}
          setSync={setLFO1Sync}
          destinations={LFO1Destinations}
          setDestinations={setLFO1Destinations}
          isSelecting={isSelectingLFOTarget}
          setIsSelecting={setIsSelectingLFOTarget}
        />
        <LFO
          engine={polySynth.current}
          name={"lfo2"}
          type={LFO2Type}
          setType={setLFO2Type}
          rate={LFO2Rate}
          setRate={setLFO2Rate}
          sync={LFO2Sync}
          setSync={setLFO2Sync}
          destinations={LFO2Destinations}
          setDestinations={setLFO2Destinations}
          isSelecting={isSelectingLFOTarget}
          setIsSelecting={setIsSelectingLFOTarget}
        />
      </div>
      <button onClick={() => Tone.start()}>Start</button>
    </div>
  );
};

export default PolySynth;
