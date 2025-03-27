"use client";
import { useAudioContextStore } from "@/lib/store/audioContextStore";
import React from "react";
import * as Tone from "tone/build/esm/index";
import styles from "./Welcome.module.css";
import { KeyboardInstruction } from "./KeyboardInstruction";

export const Welcome = () => {
  const { contextStarted, setContextStarted } = useAudioContextStore(
    (state) => ({
      contextStarted: state.contextStarted,
      setContextStarted: state.setContextStarted,
    })
  );
  const [displayWelcome, setDisplayWelcome] = React.useState(true);
  const handleStart = async () => {
    await Tone.start();
    if (Tone.getContext().state == "running") {
      setContextStarted(true);
      console.log("Audio context started");
      setDisplayWelcome(false);
    }
  };

  return (
    <div
      style={{
        display: displayWelcome ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      className={styles.wrapper}
    >
      
      <div className={styles.container}>
        <div className={styles.content}>
        <h3>PolyScape</h3>
          <p>
            Introducing our cutting-edge 10-voice synthesizer that brings
            studio-quality sound creation right to your desktop. With dual
            oscillators per voice, you can layer rich timbres and create complex
            sounds. A versatile filter section—complete with its own dedicated
            envelope—lets you sculpt and shape your sound with precision. Two
            low-frequency oscillators (LFOs) add dynamic modulation options,
            perfect for evolving textures and rhythmic effects. MIDI support
            ensures seamless integration with your hardware, while the built-in
            virtual keyboard makes it easy to experiment even without external
            gear. Plus, an innovative AI-powered preset generator helps you
            discover new sounds by creating unique preset ideas tailored to your
            creative vision. Whether you're a seasoned sound designer or just
            starting out, this app offers a powerful and intuitive platform for
            exploring synthesis and pushing the boundaries of your music.
          </p>
          
          <KeyboardInstruction />
          <button onClick={handleStart}>Start</button>
        </div>
      </div>
    </div>
  );
};
