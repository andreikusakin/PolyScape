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
    volume: -70,
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
    baseFrequency: 18000,
    octaves: 0,
    exponent: 5,
  },
  unison: false,
  panSpread: 0,
  volume: 0,
  LFO1: {
    type: "sine",
    rate: 5,
    sync: false,
    destinations: [
      { target: "osc1Volume", amount: 1 },
      { target: "osc1Fine", amount: 0.01 },
    ],
  },
};

const PolySynth = () => {
  const [preset, setPreset] = useState<Preset>(initPreset);

  const polySynth = useRef<CustomPolySynth>();

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
  >(1);
  const [LFO1Sync, setLFO1Sync] = useState<boolean>(false);
  // const [LFO1Amount, setLFO1Amount] = useState<Tone.Unit.NormalRange>(0);
  const [LFO1Destinations, setLFO1Destinations] = useState<LFOTarget[]>([]);

  //LFO2
  const [LFO2Type, setLFO2Type] = useState<
    "sine" | "triangle" | "sawtooth" | "square"
  >();
  const [LFO2Rate, setLFO2Rate] = useState<
    Tone.Unit.Frequency | Tone.FrequencyClass
  >(5);
  const [LFO2Sync, setLFO2Sync] = useState<boolean>();
  // const [LFO2Amount, setLFO2Amount] = useState<Tone.Unit.NormalRange>();
  const [LFO2Destinations, setLFO2Destinations] = useState<LFOTarget[]>();

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
    setLFO1Type(preset.LFO1?.type);
    setLFO1Rate(preset.LFO1?.rate);
    setLFO1Sync(preset.LFO1?.sync);
    // setLFO1Amount(preset.LFO1?.amount);
    setLFO1Destinations(preset.LFO1?.destinations);
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

    // polySynth.current.setLFO("osc1Coarse", 1);
    // polySynth.current.setLFO("osc1Fine", 1);
  }, [preset]);

  // update oscilators and noise types
  useEffect(() => {
    if (osc1type) {
      // polySynth.current?.voices.forEach((voice) => {
      //   voice.set({ oscillator: { type: osc1type } });
      // });
    }
  }, [osc1type]);

  useEffect(() => {
    if (oscillator2Type) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ oscillator2: { type: oscillator2Type } });
      });
    }
  }, [oscillator2Type]);

  useEffect(() => {
    if (noiseType) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ noise: { type: noiseType } });
      });
    }
  }, [noiseType]);

  // // update volume

  useEffect(() => {
    if (LFO1Destinations?.includes("osc1Volume")) {
      polySynth.current?.LFO1.find(
        (lfo) => lfo.target === "osc1Volume"
      )?.LFO.set({
        min: -70 + osc1Volume,
        max: 6 + osc1Volume,
      });
    }
    if (LFO2Destinations?.includes("osc1Volume")) {
      polySynth.current?.LFO2.find(
        (lfo) => lfo.target === "osc1Volume"
      )?.LFO.set({
        min: -70 + osc1Volume,
        max: 6 + osc1Volume,
      });
    }
    const volumeValue = osc1Volume ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator: { volume: volumeValue } });
    });
  }, [osc1Volume]);

  useEffect(() => {
    const volumeValue = osc2Volume ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator2: { volume: volumeValue } });
    });
  }, [osc2Volume]);

  useEffect(() => {
    const volumeValue = noiseVolume ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ noise: { volume: volumeValue } });
    });
  }, [noiseVolume]);

  // update fine
  useEffect(() => {
    polySynth.current?.LFO1.find((lfo) => lfo.target === "osc1Fine")?.LFO.set({
      min: -100 + osc1Fine,
      max: 100 + osc1Fine,
    });
    const fineValue = osc1Fine + osc1Coarse * 100 ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator: { detune: fineValue } });
    });
  }, [osc1Fine]);

  useEffect(() => {
    const fineValue = osc2Fine + osc2Transpose ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator2: { detune: fineValue } });
    });
  }, [osc2Fine]);

  // // update transpose

  useEffect(() => {
    polySynth.current?.LFO1.find((lfo) => lfo.target === "osc1Coarse")?.LFO.set(
      { min: -2400 + osc1Coarse * 100, max: 2400 + osc1Coarse * 100 }
    );
    const transposeValue = osc1Coarse * 100 + osc1Fine ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator: { detune: transposeValue } });
    });
  }, [osc1Coarse]);

  useEffect(() => {
    const transposeValue = osc2Transpose + osc1Fine ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator2: { detune: transposeValue } });
    });
  }, [osc2Transpose]);

  // update pulse width

  useEffect(() => {
    const pulseWidthValue = osc1PulseWidth ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator: { width: pulseWidthValue } });
    });
  }, [osc1PulseWidth]);

  useEffect(() => {
    const pulseWidthValue = osc2PulseWidth ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ oscillator2: { width: pulseWidthValue } });
    });
  }, [osc2PulseWidth]);

  // update envelopes
  useEffect(() => {
    if (attack) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ envelope: { attack: attack } });
      });
    }
  }, [attack]);

  useEffect(() => {
    if (decay) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ envelope: { decay: decay } });
      });
    }
  }, [decay]);

  useEffect(() => {
    const sustainValue = sustain ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ envelope: { sustain: sustainValue } });
    });
  }, [sustain]);

  useEffect(() => {
    if (release) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ envelope: { release: release } });
      });
    }
  }, [release]);

  // update filter

  useEffect(() => {
    if (filterType) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filter: { type: filterType } });
      });
    }
  }, [filterType]);

  useEffect(() => {
    if (filterFrequency) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filter: { frequency: filterFrequency } });
      });
    }
  }, [filterFrequency]);

  useEffect(() => {
    if (filterRolloff) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filter: { rolloff: filterRolloff } });
      });
    }
  }, [filterRolloff]);

  useEffect(() => {
    if (filterQ) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filter: { Q: filterQ } });
      });
    }
  }, [filterQ]);

  // update filter envelope

  useEffect(() => {
    if (filterEnvelopeAttack) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filterEnvelope: { attack: filterEnvelopeAttack } });
      });
    }
  }, [filterEnvelopeAttack]);

  useEffect(() => {
    if (filterEnvelopeDecay) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filterEnvelope: { decay: filterEnvelopeDecay } });
      });
    }
  }, [filterEnvelopeDecay]);

  useEffect(() => {
    const sustain = filterEnvelopeSustain ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ filterEnvelope: { sustain: sustain } });
    });
  }, [filterEnvelopeSustain]);

  useEffect(() => {
    if (filterEnvelopeRelease) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filterEnvelope: { release: filterEnvelopeRelease } });
      });
    }
  }, [filterEnvelopeRelease]);

  useEffect(() => {
    if (filterEnvelopeBaseFrequency) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({
          filterEnvelope: { baseFrequency: filterEnvelopeBaseFrequency },
        });
      });
    }
  }, [filterEnvelopeBaseFrequency]);

  useEffect(() => {
    if (filterEnvelopeExponent) {
      polySynth.current?.voices.forEach((voice) => {
        voice.set({ filterEnvelope: { exponent: filterEnvelopeExponent } });
      });
    }
  }, [filterEnvelopeExponent]);

  useEffect(() => {
    const octaves = filterEnvelopeOctaves ?? 0;
    polySynth.current?.voices.forEach((voice) => {
      voice.set({ filterEnvelope: { octaves: octaves } });
    });
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
  }, [unison]);

  // LFO1

  useEffect(() => {
    if (LFO1Destinations) {
      LFO1Destinations.forEach((destination) => {
        polySynth.current?.setLFO(destination, 1);
      });
    }
  }, [LFO1Destinations]);

  useEffect(() => {
    if (LFO1Type) {
      polySynth.current?.LFO1.forEach((lfo) => {
        lfo.LFO.set({ type: LFO1Type });
      });
    }
  }, [LFO1Type]);

  useEffect(() => {
    if (LFO1Rate) {
      polySynth.current?.LFO1.forEach((lfo) => {
        lfo.LFO.set({ frequency: LFO1Rate });
      });
    }
  }, [LFO1Rate]);

  // useEffect(() => {
  //   if (LFO1Amount) {
  //     polySynth.current?.LFO1.forEach((lfo) => {
  //       lfo.LFO.set({ amplitude: LFO1Amount });
  //     });
  //   }
  // }, [LFO1Amount]);

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
        />
        <Oscillator
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
        />
      </div>
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
        <LFO
          name={"LFO1"}
          type={LFO1Type}
          setType={setLFO1Type}
          rate={LFO1Rate}
          setRate={setLFO1Rate}
          sync={LFO1Sync}
          setSync={setLFO1Sync}
          destinations={LFO1Destinations}
          setDestinations={setLFO1Destinations}
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
                onChange={() => {
                  setOsc1Type("sine");
                  polySynth.current?.voices.forEach((voice) => {
                    voice.set({ oscillator: { type: "sine" } });
                  });
                }}
              />
            </label>
            <label>
              Sawtooth
              <input
                type="checkbox"
                checked={osc1type === "sawtooth"}
                onChange={() => {
                  setOsc1Type("sawtooth");
                  polySynth.current?.voices.forEach((voice) => {
                    voice.set({ oscillator: { type: "sawtooth" } });
                  });
                }}
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
              value={osc1Coarse}
              onChange={(e) => {
                setosc1Coarse(Number(e.target.value));
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
