"use client";
import { useAudioContextStore } from "@/lib/store/audioContextStore";
import React from "react";
import * as Tone from "tone/build/esm/index";
import styles from "./Welcome.module.css";
import { KeyboardInstruction } from "./KeyboardInstruction";
import Link from "next/link";

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
            PolyScape is a web-based synthesizer with 3D visualization. It
            features two oscillators, two LFOs for modulation, and a number of
            effects such as reverb, delay, and chorus. To play, use your MIDI
            instrument or virtual keyboard. Note that MIDI is not supported in
            Safari.
          </p>

          <KeyboardInstruction />
          <button onClick={handleStart} className={styles.start_button}>
            Start
          </button>
          <div className={styles.credits}>
            Made with love and passion by{" "}
            <Link href="https://www.kusakin.dev/" target="_blank">
              Andrew Kusakin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
