"use-client";
import { useState, useEffect, useRef, use } from "react";
import * as Tone from "tone/build/esm/index";

import { Preset } from "@/lib/types/types";
import Knob from "./Knob/Knob";
import Oscillator from "./Oscillator/Oscillator";
import Noise from "./Noise/Noise";
import { Filter } from "./Filter/Filter";
import { CustomVoice } from "@/lib/engines/CustomVoice";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
import { Envelope } from "./Envelope/Envelope";

const initPreset: Preset = {
  osc1: {
    type: "pulse",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  osc2: {
    type: "sine",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  noise: {
    type: "white",
    volume: 0,
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
    baseFrequency: 18000,
    octaves: 0,
    exponent: 5,
  },
  unison: false,
  panSpread: 0,
};

const PolySynth = () => {
  const [preset, setPreset] = useState<Preset>(initPreset);

  const polySynth = useRef<CustomPolySynth>();

  // OSC1
  const [osc1type, setOsc1Type] = useState<
    "sawtooth" | "sine" | "pulse" | "triangle"
  >("sine");
  const [osc1Fine, setOsc1Fine] = useState<number>(0);
  const [osc1Transpose, setOsc1Transpose] = useState<number>(0);
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

  const [noiseType, setNoiseType] = useState<"white" | "pink" | "brown">("white")
  const [noiseVolume, setNoiseVolume] = useState<number>(0)

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

  function loadPreset(preset: Preset) {
    // OSC1
    setOsc1Type(preset.osc1.type);
    setOsc1Fine(preset.osc1.detune);
    setOsc1Transpose(preset.osc1.transpose);
    setOsc1PulseWidth(preset.osc1.pulseWidth);
    setOsc1Volume(preset.osc1.volume);
    // OSC2
    setOscillator2Type(preset.osc2.type);
    setOsc2Fine(preset.osc2.detune);
    setOsc2Transpose(preset.osc2.transpose);
    setOsc2PulseWidth(preset.osc2.pulseWidth);
    setOsc2Volume(preset.osc2.volume);
    // Noise
    setNoiseType(preset.noise.type)
    setNoiseVolume(preset.noise.volume)
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
  }
  useEffect(() => {
    loadPreset(preset);
  }, []);

  // initialize synth
  useEffect(() => {
    const gainNode = new Tone.Gain({
      gain: 0.06,
      units: "gain",
    }).toDestination();

    polySynth.current = new CustomPolySynth(gainNode, initPreset);
  }, [preset]);

  // update oscilators and noise types
  useEffect(() => {
    if (osc1type) {
      polySynth.current?.voices.forEach((voice) => {voice.set({oscillator: {type: osc1type}})});
      console.log("osc1 type changed to: ", osc1type);
    }
  }, [osc1type]);

  useEffect(() => {
    if (oscillator2Type) {
      polySynth.current?.voices.forEach((voice) => {voice.set({oscillator2: {type: oscillator2Type}})});
      console.log("osc2 type changed to: ", oscillator2Type);
    }
  }, [oscillator2Type]);

  useEffect(() => {
    if (noiseType) {
      polySynth.current?.voices.forEach((voice) => {voice.set({noise: {type: noiseType}})});
      console.log("noise type changed to: ", noiseType);
    }
  }, [noiseType]);

  // // update volume 

  useEffect(() => {
    const volumeValue = osc1Volume ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({ oscillator: { volume: volumeValue } })});
    console.log("osc1 volume changed to: ", volumeValue);
  }, [osc1Volume]);

  useEffect(() => {
    const volumeValue = osc2Volume ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({ oscillator2: { volume: volumeValue } })});
    console.log("osc2 volume changed to: ", volumeValue);
  }, [osc2Volume]);

  useEffect(() => {
    const volumeValue = noiseVolume ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({noise: {volume: volumeValue}})});
    console.log("noise volume changed to: ", volumeValue);
  }, [noiseVolume]);

  // update detune
  useEffect(() => {
    const detuneValue = osc1Fine + (osc1Transpose * 100) ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({oscillator: {detune: detuneValue}})});
    console.log("osc1 detune changed to: ", detuneValue);
  }, [osc1Fine]);

  useEffect(() => {
    const detuneValue = osc2Fine + osc2Transpose ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({oscillator2: {detune: detuneValue}})});
    console.log("osc2 detune changed to: ", detuneValue);
  }, [osc2Fine]);

  // // update transpose

  useEffect(() => {
    const transposeValue = (osc1Transpose * 100) + osc1Fine ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({oscillator: {detune: transposeValue}})});
    console.log("osc1Transpose state changed to: ", transposeValue);
  }, [osc1Transpose]);

  useEffect(() => {
    const transposeValue = osc2Transpose + osc1Fine ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({oscillator2: {detune: transposeValue}})});
    console.log("osc2Transpose state changed to: ", transposeValue);
  }, [osc2Transpose]);

  // update pulse width

  useEffect(() => {
    const pulseWidthValue = osc1PulseWidth ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({oscillator: {width: pulseWidthValue}})});
    console.log("osc1PulseWidth state changed to: ", pulseWidthValue);
  }, [osc1PulseWidth]);

  useEffect(() => {
    const pulseWidthValue = osc2PulseWidth ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({oscillator2: {width: pulseWidthValue}})});
    console.log("osc2PulseWidth state changed to: ", pulseWidthValue);
  }, [osc2PulseWidth]);

  // update envelopes
  useEffect(() => {
    if (attack) {
      polySynth.current?.voices.forEach((voice) => {voice.set({envelope: {attack: attack}})});
      console.log("attack changed to: ", attack);
    }
  }, [attack]);

  useEffect(() => {
    if (decay) {
      polySynth.current?.voices.forEach((voice) => {voice.set({envelope: {decay: decay}})});
      console.log("decay changed to: ", decay);
    }
  }, [decay]);

  useEffect(() => {
    const sustainValue = sustain ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({envelope: {sustain: sustainValue}})});
    console.log("sustain changed to: ", sustain);
  }, [sustain]);

  useEffect(() => {
    if (release) {
      polySynth.current?.voices.forEach((voice) => {voice.set({envelope: {release: release}})});
      console.log("release changed to: ", release);
    }
  }, [release]);

  // update filter

  useEffect(() => {
    if (filterType) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filter: {type: filterType}})});
      console.log("filter type changed to: ", filterType);
    }
  }, [filterType]);

  useEffect(() => {
    if (filterFrequency) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filter: {frequency: filterFrequency}})});
      console.log("filter frequency changed to: ", filterFrequency);
    }
  }, [filterFrequency]);

  useEffect(() => {
    if (filterRolloff) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filter: {rolloff: filterRolloff}})});
      console.log("filter rolloff changed to: ", filterRolloff);
    }
  }, [filterRolloff]);

  useEffect(() => {
    if (filterQ) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filter: {Q: filterQ}})});
      console.log("filter Q changed to: ", filterQ);
    }
  }, [filterQ]);

  // update filter envelope

  useEffect(() => {
    if (filterEnvelopeAttack) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {attack: filterEnvelopeAttack}})});
      console.log("filter envelope attack changed to: ", filterEnvelopeAttack);
    }
  }, [filterEnvelopeAttack]);

  useEffect(() => {
    if (filterEnvelopeDecay) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {decay: filterEnvelopeDecay}})});
      console.log("filter envelope decay changed to: ", filterEnvelopeDecay);
    }
  }, [filterEnvelopeDecay]);

  useEffect(() => {
    const sustain = filterEnvelopeSustain ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {sustain: sustain}})});
    console.log("filter envelope sustain changed to: ", filterEnvelopeSustain);
  }, [filterEnvelopeSustain]);

  useEffect(() => {
    if (filterEnvelopeRelease) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {release: filterEnvelopeRelease}})});
      console.log(
        "filter envelope release changed to: ",
        filterEnvelopeRelease
      );
    }
  }, [filterEnvelopeRelease]);

  useEffect(() => {
    if (filterEnvelopeBaseFrequency) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {baseFrequency: filterEnvelopeBaseFrequency}})});
      console.log(
        "filter envelope base frequency changed to: ",
        filterEnvelopeBaseFrequency
      );
    }
  }, [filterEnvelopeBaseFrequency]);

  useEffect(() => {
    if (filterEnvelopeExponent) {
      polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {exponent: filterEnvelopeExponent}})});
      console.log(
        "filter envelope exponent changed to: ",
        filterEnvelopeExponent
      );
    }
  }, [filterEnvelopeExponent]);

  useEffect(() => {
    const octaves = filterEnvelopeOctaves ?? 0;
    polySynth.current?.voices.forEach((voice) => {voice.set({filterEnvelope: {octaves: octaves}})});
    console.log("filter envelope octaves changed to: ", filterEnvelopeOctaves);
  }, [filterEnvelopeOctaves]);

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
    console.log("unison changed to: ", unisonValue);
  }, [unison]);


  // // LFOs

  // useEffect(() => {
  //   polySynth.current?.setLFO1DestinationEngine("osc1PW");
  // }, [preset]);



  

  return (
    <div className="flex w-full h-full gap-10 ">
      <div>
      <Oscillator
        engine={polySynth.current}
        name={"osc1"}
        oscType={osc1type}
        setOscillatorType={setOsc1Type}
        coarse={osc1Transpose}
        setCoarse={setOsc1Transpose}
        detune={osc1Fine}
        setDetune={setOsc1Fine}
        pulseWidth={osc1PulseWidth}
        setPulseWidth={setOsc1PulseWidth}
        volume={osc1Volume}
        setVolume={setOsc1Volume}
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
      />
      <Noise
        name={"noise"}
        type={noiseType}
        setType={setNoiseType}
        volume={noiseVolume}
        setVolume={setNoiseVolume}
      /></div>
      <div>
        <Filter 
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
      </div>
      <button onClick={() => Tone.start()}>Start</button>
      <div className="flex flex-col gap-10">
        <div className="flex gap-5 flex-col">
          OSC1
          <div className="flex gap-5">
            <label>
              Sine
              <input
                type="checkbox"
                checked={osc1type === "sine"}
                onChange={() => setOsc1Type("sine")}
              />
            </label>
            <label>
              Sawtooth
              <input
                type="checkbox"
                checked={osc1type === "sawtooth"}
                onChange={() => setOsc1Type("sawtooth")}
              />
            </label>
            <label>
              Square
              <input
                type="checkbox"
                checked={osc1type === "pulse"}
                onChange={() => setOsc1Type("pulse")}
              />
            </label>
            <label>
              Triangle
              <input
                type="checkbox"
                checked={osc1type === "triangle"}
                onChange={() => setOsc1Type("triangle")}
              />
            </label>
          </div>
          <label>
            Volume
            <input
              type="range"
              min="-96"
              max="6"
              step="1"
              value={osc1Volume}
              onChange={(e) => {
                setOsc1Volume(Number(e.target.value));
              }}
            />
          </label>
          <label>
            Detune
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={osc1Fine}
              onChange={(e) => {
                setOsc1Fine(Number(e.target.value));
              }}
            />
          </label>
          <label>
            Transpose
            <input
              type="range"
              min="-24"
              max="24"
              step="1"
              value={osc1Transpose}
              onChange={(e) => {
                setOsc1Transpose(Number(e.target.value));
              }}
            />
          </label>
          <label>
            Pulse Width
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={osc1PulseWidth}
              onChange={(e) => {
                setOsc1PulseWidth(Number(e.target.value));
              }}
            />
          </label>
        </div>
        <div className="flex gap-5 flex-col">
          OSC2
          <div className="flex gap-5">
            <label>
              Sine
              <input
                type="checkbox"
                checked={oscillator2Type === "sine"}
                onChange={() => setOscillator2Type("sine")}
              />
            </label>
            <label>
              Sawtooth
              <input
                type="checkbox"
                checked={oscillator2Type === "sawtooth"}
                onChange={() => setOscillator2Type("sawtooth")}
              />
            </label>
            <label>
              Square
              <input
                type="checkbox"
                checked={oscillator2Type === "pulse"}
                onChange={() => setOscillator2Type("pulse")}
              />
            </label>
            <label>
              Triangle
              <input
                type="checkbox"
                checked={oscillator2Type === "triangle"}
                onChange={() => setOscillator2Type("triangle")}
              />
            </label>
          </div>
          <label>
            Volume
            <input
              type="range"
              min="-96"
              max="6"
              step="1"
              value={osc2Volume}
              onChange={(e) => {
                setOsc2Volume(Number(e.target.value));
              }}
            />
          </label>
          <label>
            Detune
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={osc2Fine}
              onChange={(e) => {
                setOsc2Fine(Number(e.target.value));
              }}
            />
          </label>
          <label>
            Transpose
            <input
              type="range"
              min="-24"
              max="24"
              step="1"
              value={osc2Transpose}
              onChange={(e) => {
                setOsc2Transpose(Number(e.target.value));
              }}
            />
          </label>
          <label>
            Pulse Width
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={osc2PulseWidth}
              onChange={(e) => {
                setOsc2PulseWidth(Number(e.target.value));
              }}
            />
          </label>
        </div>
      </div>
      <div className="flex gap-5 flex-col">
        FILTER
        <div className="flex gap-5">
          <label>
            Lowpass
            <input
              type="checkbox"
              checked={filterType === "lowpass"}
              onChange={() => setFilterType("lowpass")}
            />
          </label>
          <label>
            Highpass
            <input
              type="checkbox"
              checked={filterType === "highpass"}
              onChange={() => setFilterType("highpass")}
            />
          </label>
          <label>
            Bandpass
            <input
              type="checkbox"
              checked={filterType === "bandpass"}
              onChange={() => setFilterType("bandpass")}
            />
          </label>
          <label>
            Notch
            <input
              type="checkbox"
              checked={filterType === "notch"}
              onChange={() => setFilterType("notch")}
            />
          </label>
        </div>
        <label>
          Frequency
          <input
            type="range"
            min="0"
            max="15000"
            step="1"
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(Number(e.target.value))}
          />
        </label>
        <div className="flex gap-5">
          Rolloff
          <label>
            12
            <input
              type="checkbox"
              checked={filterRolloff === -12}
              onChange={() => setFilterRolloff(-12)}
            />
          </label>
          <label>
            24
            <input
              type="checkbox"
              checked={filterRolloff === -24}
              onChange={() => setFilterRolloff(-24)}
            />
          </label>
          <label>
            48
            <input
              type="checkbox"
              checked={filterRolloff === -48}
              onChange={() => setFilterRolloff(-48)}
            />
          </label>
        </div>
        <label>
          Q
          <input
            type="range"
            min="0"
            max="15"
            step="0.1"
            value={filterQ}
            onChange={(e) => setFilterQ(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="flex gap-5 flex-col">
        <div className="flex gap-5 flex-col">
          AMPLITUDE ENVELOPE
          <label>
            Attack
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              value={attack}
              onChange={(e) => setAttack(Number(e.target.value))}
            />
          </label>
          <label>
            Decay
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              value={decay}
              onChange={(e) => setDecay(Number(e.target.value))}
            />
          </label>
          <label>
            Sustain
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sustain}
              onChange={(e) => setSustain(Number(e.target.value))}
            />
          </label>
          <label>
            Release
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              value={release}
              onChange={(e) => setRelease(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="flex gap-5 flex-col">
          FILTER ENVELOPE
          <label>
            Attack
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              value={filterEnvelopeAttack}
              onChange={(e) => setFilterEnvelopeAttack(Number(e.target.value))}
            />
          </label>
          <label>
            Decay
            <input
              type="range"
              min="0.01"
              max="100"
              step="0.01"
              value={filterEnvelopeDecay}
              onChange={(e) => setFilterEnvelopeDecay(Number(e.target.value))}
            />
          </label>
          <label>
            Sustain
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={filterEnvelopeSustain}
              onChange={(e) => setFilterEnvelopeSustain(Number(e.target.value))}
            />
          </label>
          <label>
            Release
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.01"
              value={filterEnvelopeRelease}
              onChange={(e) => setFilterEnvelopeRelease(Number(e.target.value))}
            />
          </label>
          <label>
            Base Frequency
            <input
              type="range"
              min="0"
              max="15000"
              step="1"
              value={filterEnvelopeBaseFrequency}
              onChange={(e) =>
                setFilterEnvelopeBaseFrequency(Number(e.target.value))
              }
            />
          </label>
          <label>
            Exponent
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={filterEnvelopeExponent}
              onChange={(e) =>
                setFilterEnvelopeExponent(Number(e.target.value))
              }
            />
          </label>
          <label>
            Octaves
            <input
              type="range"
              min="0"
              max="7"
              step="0.01"
              value={filterEnvelopeOctaves}
              onChange={(e) => setFilterEnvelopeOctaves(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-5 flex-col">
        FX
        <label>
          Pan Spread
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={panSpread}
            onChange={(e) => setPanSpread(Number(e.target.value))}
          />
        </label>
        <label>
          Unison
          <input
            type="checkbox"
            checked={unison}
            onChange={() => setUnison(!unison)}
          />
        </label>
      </div>
    </div>
  );
};

export default PolySynth;
