"use-client";
import { useState, useEffect, useRef, use } from "react";
import * as Tone from "tone/build/esm/index";
import PolySynthEngine from "@/lib/engines/PolySynthEngine";
import { Preset } from "@/lib/types/types";

const initPreset: Preset = {
  osc1: {
    type: "sine",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
  },
  osc2: {
    type: "sine",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.01,
  },
  filter: { type: "lowpass", frequency: 0, rolloff: -12, Q: 0 },
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
};

const PolySynth = () => {
  const [preset, setPreset] = useState<Preset>(initPreset);

  const polySynthEngine = useRef<PolySynthEngine>();

  // OSC1
  const [oscillator1Type, setOscillator1Type] = useState<
    "sawtooth" | "sine" | "pulse" | "triangle"
  >("sine");
  const [osc1Detune, setOsc1Detune] = useState<number>(0);
  const [osc1Transpose, setOsc1Transpose] = useState<number>(0);
  const [osc1PulseWidth, setOsc1PulseWidth] = useState<number>(0);

  // OSC2
  const [oscillator2Type, setOscillator2Type] = useState<
    "sawtooth" | "sine" | "pulse" | "triangle"
  >("sine");
  const [osc2Detune, setOsc2Detune] = useState<number>(0);
  const [osc2Transpose, setOsc2Transpose] = useState<number>(0);
  const [osc2PulseWidth, setOsc2PulseWidth] = useState<number>(0);

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
    setOscillator1Type(preset.osc1.type);
    setOsc1Detune(preset.osc1.detune);
    setOsc1Transpose(preset.osc1.transpose);
    setOsc1PulseWidth(preset.osc1.pulseWidth);

    setOscillator2Type(preset.osc2.type);
    setOsc2Detune(preset.osc2.detune);
    setOsc2Transpose(preset.osc2.transpose);
    setOsc2PulseWidth(preset.osc2.pulseWidth);

    setAttack(preset.envelope.attack);
    setDecay(preset.envelope.decay);
    setSustain(preset.envelope.sustain);
    setRelease(preset.envelope.release);

    setFilterType(preset.filter.type);
    setFilterFrequency(preset.filter.frequency);
    setFilterRolloff(preset.filter.rolloff);
    setFilterQ(preset.filter.Q);

    setFilterEnvelopeAttack(preset.filterEnvelope.attack);
    setFilterEnvelopeDecay(preset.filterEnvelope.decay);
    setFilterEnvelopeSustain(preset.filterEnvelope.sustain);
    setFilterEnvelopeRelease(preset.filterEnvelope.release);
    setFilterEnvelopeBaseFrequency(preset.filterEnvelope.baseFrequency);
    setFilterEnvelopeOctaves(preset.filterEnvelope.octaves);
    setFilterEnvelopeExponent(preset.filterEnvelope.exponent);

    setPanSpread(preset.panSpread);
    setUnison(preset.unison);
  }
  useEffect(() => {
    loadPreset(preset);
  }, []);

  console.log("preset: ", preset);
  console.log("sustain: ", sustain);

  // initialize synth
  useEffect(() => {
    const filterNode = new Tone.Gain({
      gain: 0.06,
      units: "normalRange",
    }).toDestination();

    polySynthEngine.current = new PolySynthEngine(filterNode, initPreset);
  }, [preset]);

  // update oscilators types
  useEffect(() => {
    if (oscillator1Type) {
      polySynthEngine.current?.setOscTypeEngine(oscillator1Type, 1);
      console.log("osc1 type changed to: ", oscillator1Type);
    }
  }, [oscillator1Type]);

  useEffect(() => {
    if (oscillator2Type) {
      polySynthEngine.current?.setOscTypeEngine(oscillator2Type, 2);
      console.log("osc2 type changed to: ", oscillator2Type);
    }
  }, [oscillator2Type]);

  // update detune
  useEffect(() => {
    const detuneValue = osc1Detune ?? 0;
    polySynthEngine.current?.setOscDetuneEngine(detuneValue, 1);
    console.log("osc1 detune changed to: ", detuneValue);
  }, [osc1Detune]);

  useEffect(() => {
    const detuneValue = osc2Detune ?? 0;
    polySynthEngine.current?.setOscDetuneEngine(detuneValue, 2);
    console.log("osc2 detune changed to: ", detuneValue);
  }, [osc2Detune]);

  // update transpose

  useEffect(() => {
    const transposeValue = osc1Transpose ?? 0;
    polySynthEngine.current?.setOscTransposeEngine(transposeValue, 1);
    console.log("osc1Transpose state changed to: ", transposeValue);
  }, [osc1Transpose]);

  useEffect(() => {
    const transposeValue = osc2Transpose ?? 0;
    polySynthEngine.current?.setOscTransposeEngine(transposeValue, 2);
    console.log("osc2Transpose state changed to: ", transposeValue);
  }, [osc2Transpose]);

  // update pulse width

  useEffect(() => {
    const pulseWidthValue = osc1PulseWidth ?? 0;
    polySynthEngine.current?.setPulseWidthEngine(pulseWidthValue, 1);
    console.log("osc1PulseWidth state changed to: ", pulseWidthValue);
  }, [osc1PulseWidth]);

  useEffect(() => {
    const pulseWidthValue = osc2PulseWidth ?? 0;
    polySynthEngine.current?.setPulseWidthEngine(pulseWidthValue, 2);
    console.log("osc2PulseWidth state changed to: ", pulseWidthValue);
  }, [osc2PulseWidth]);

  // update envelopes
  useEffect(() => {
    if (attack) {
      polySynthEngine.current?.setAttackEngine(attack);
      console.log("attack changed to: ", attack);
    }
  }, [attack]);

  useEffect(() => {
    if (decay) {
      polySynthEngine.current?.setDecayEngine(decay);
      console.log("decay changed to: ", decay);
    }
  }, [decay]);

  useEffect(() => {
    const sustainValue = sustain ?? 0;
    polySynthEngine.current?.setSustainEngine(sustainValue);
    console.log("sustain changed to: ", sustain);
  }, [sustain]);

  useEffect(() => {
    if (release) {
      polySynthEngine.current?.setReleaseEngine(release);
      console.log("release changed to: ", release);
    }
  }, [release]);

  // update filter

  useEffect(() => {
    if (filterType) {
      polySynthEngine.current?.setFilterTypeEngine(filterType);
      console.log("filter type changed to: ", filterType);
    }
  }, [filterType]);

  useEffect(() => {
    if (filterFrequency) {
      polySynthEngine.current?.setFilterFrequencyEngine(filterFrequency);
      console.log("filter frequency changed to: ", filterFrequency);
    }
  }, [filterFrequency]);

  useEffect(() => {
    if (filterRolloff) {
      polySynthEngine.current?.setFilterRollOffEngine(filterRolloff);
      console.log("filter rolloff changed to: ", filterRolloff);
    }
  }, [filterRolloff]);

  useEffect(() => {
    if (filterQ) {
      polySynthEngine.current?.setFilterQEngine(filterQ);
      console.log("filter Q changed to: ", filterQ);
    }
  }, [filterQ]);

  // update filter envelope

  useEffect(() => {
    if (filterEnvelopeAttack) {
      polySynthEngine.current?.setFilterEnvelopeAttackEngine(
        filterEnvelopeAttack
      );
      console.log("filter envelope attack changed to: ", filterEnvelopeAttack);
    }
  }, [filterEnvelopeAttack]);

  useEffect(() => {
    if (filterEnvelopeDecay) {
      polySynthEngine.current?.setFilterEnvelopeDecayEngine(
        filterEnvelopeDecay
      );
      console.log("filter envelope decay changed to: ", filterEnvelopeDecay);
    }
  }, [filterEnvelopeDecay]);

  useEffect(() => {
    const sustain = filterEnvelopeSustain ?? 0;
    polySynthEngine.current?.setFilterEnvelopeSustainEngine(sustain);

    console.log("filter envelope sustain changed to: ", filterEnvelopeSustain);
  }, [filterEnvelopeSustain]);

  useEffect(() => {
    if (filterEnvelopeRelease) {
      polySynthEngine.current?.setFilterEnvelopeReleaseEngine(
        filterEnvelopeRelease
      );
      console.log(
        "filter envelope release changed to: ",
        filterEnvelopeRelease
      );
    }
  }, [filterEnvelopeRelease]);

  useEffect(() => {
    if (filterEnvelopeBaseFrequency) {
      polySynthEngine.current?.setFilterEnvelopeFrequencyEngine(
        filterEnvelopeBaseFrequency
      );
      console.log(
        "filter envelope base frequency changed to: ",
        filterEnvelopeBaseFrequency
      );
    }
  }, [filterEnvelopeBaseFrequency]);

  useEffect(() => {
    if (filterEnvelopeExponent) {
      polySynthEngine.current?.setFilterEnvelopeExponentEngine(
        filterEnvelopeExponent
      );
      console.log(
        "filter envelope exponent changed to: ",
        filterEnvelopeExponent
      );
    }
  }, [filterEnvelopeExponent]);

  useEffect(() => {
    const octaves = filterEnvelopeOctaves ?? 0;
    polySynthEngine.current?.setFilterEnvelopeOctavesEngine(octaves);
    console.log("filter envelope octaves changed to: ", filterEnvelopeOctaves);
  }, [filterEnvelopeOctaves]);

  // update fx

  useEffect(() => {
    const panValue = panSpread ?? 0;
    polySynthEngine.current?.setPanSpreadEngine(panValue);
    console.log("panSpread changed to: ", panValue);
  }, [panSpread]);

  useEffect(() => {
    const unisonValue = unison ?? false;
    polySynthEngine.current?.setUnisonEngine(unisonValue);
    console.log("unison changed to: ", unisonValue);
  }, [unison]);

  return (
    <div className="flex w-full h-full gap-10">
      <button onClick={() => Tone.start()}>Start</button>
      <div className="flex flex-col gap-10">
        <div className="flex gap-5 flex-col">
          OSC1
          <div className="flex gap-5">
            <label>
              Sine
              <input
                type="checkbox"
                checked={oscillator1Type === "sine"}
                onChange={() => setOscillator1Type("sine")}
              />
            </label>
            <label>
              Sawtooth
              <input
                type="checkbox"
                checked={oscillator1Type === "sawtooth"}
                onChange={() => setOscillator1Type("sawtooth")}
              />
            </label>
            <label>
              Square
              <input
                type="checkbox"
                checked={oscillator1Type === "pulse"}
                onChange={() => setOscillator1Type("pulse")}
              />
            </label>
            <label>
              Triangle
              <input
                type="checkbox"
                checked={oscillator1Type === "triangle"}
                onChange={() => setOscillator1Type("triangle")}
              />
            </label>
          </div>
          <label>
            Detune
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              defaultValue={osc1Detune}
              onChange={(e) => {
                setOsc1Detune(Number(e.target.value));
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
              defaultValue={osc1Transpose}
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
              defaultValue={osc1PulseWidth}
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
            Detune
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              defaultValue={osc2Detune}
              onChange={(e) => {
                setOsc2Detune(Number(e.target.value));
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
              defaultValue={osc2Transpose}
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
              defaultValue={osc2PulseWidth}
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
            defaultValue={filterFrequency}
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
            defaultValue={filterQ}
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
              defaultValue={attack}
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
              defaultValue={decay}
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
              defaultValue={sustain}
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
              defaultValue={release}
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
              defaultValue={filterEnvelopeAttack}
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
              defaultValue={filterEnvelopeDecay}
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
              defaultValue={filterEnvelopeSustain}
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
              defaultValue={filterEnvelopeRelease}
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
              defaultValue={filterEnvelopeBaseFrequency}
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
              defaultValue={filterEnvelopeExponent}
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
              defaultValue={filterEnvelopeOctaves}
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
            defaultValue={panSpread}
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
