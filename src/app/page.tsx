"use client";
import * as Tone from "tone/build/esm/index";
import { CustomVoice } from "@/lib/engines/CustomVoice";
import { VariableOscillator } from "@/lib/engines/VariableOscilator";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useRef } from "react";
import { parse } from "path";
import { CustomPolySynth } from "@/lib/engines/CustomPolySynth";
import CustomPolySynthEngine from "@/lib/engines/CustomPolySynth";
import AudioKeys from "audiokeys";

import { Preset, LFOTarget } from "@/lib/types/types";

const initPreset: Preset = {
  osc1: {
    type: "sine",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  osc2: {
    type: "pulse",
    detune: 0,
    transpose: 0,
    pulseWidth: 0,
    volume: 0,
  },
  noise: {
    type: "brown",
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
    baseFrequency: 15000,
    octaves: 0,
    exponent: 5,
  },
  unison: false,
  panSpread: 0,
};

export default function Home() {

  navigator.requestMIDIAccess().then((midiAccess) => {console.log(midiAccess)});

  const varOsc = useRef<VariableOscillator>();
  const customVoice = useRef<CustomVoice>();
  const customPolySynth = useRef<CustomPolySynth>();
  const customPolySynthEngine = useRef<CustomPolySynthEngine>();
  const audioKeys = useRef<AudioKeys>();

  useEffect(() => {
    const gain = new Tone.Gain(0.01).toDestination();


    customPolySynthEngine.current = new CustomPolySynthEngine(gain, initPreset);

    customVoice.current = new CustomVoice().connect(gain);
    // customVoice.current.connect(gain);

    // const nodeOsc = new Tone.ToneOscillatorNode().connect(gain);
    // const monoSynth = new Tone.MonoSynth({ volume: -20 }).connect(gain);

    // const osc = new Tone.OmniOscillator({ frequency: 440 }).connect(gain);

    // audioKeys.current.down((note: any) => {
    //   osc.frequency.value = note.frequency;
    //   osc.start();
    // });
    // audioKeys.current.up((note: any) => {
    //   osc.stop();
    // });

    // audioKeys.current = new AudioKeys();
   

   

    

    // audioKeys.current?.down((note: any) => {
    //   console.log(`Attack: ${note.frequency}`);
    //   customVoice.current?.triggerAttack(note.frequency, Tone.now(), note.velocity);
    // });
    // audioKeys.current?.up((note: any) => {
    //   console.log(`Release: ${note.frequency}`);
    //   customVoice.current?.triggerRelease();
    // });
  }, []);

  function changeFreq(e: React.ChangeEvent<HTMLInputElement>) {
    varOsc.current?.setMorph(parseFloat(e.target.value));
    console.log(parseFloat(e.target.value));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <button onClick={() => Tone.start()}>start</button>
{/* 
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          defaultValue={0}
          onChange={(e) =>
            customVoice.current?.oscillator2.setMorph(
              parseFloat(e.target.value)
            )
          }
        />
        <input
          type="range"
          min="0.001"
          max="0.999"
          step="0.001"
          defaultValue={0.5}
          onChange={(e) =>
            customVoice.current?.oscillator2.setDutyCycle(
              parseFloat(e.target.value)
            )
          }
        /> */}
      </Suspense>
    </main>
  );
}
