"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone/build/esm/index";
import { useMemo } from "react";
import styles from "./Keys.module.css";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";
// @ts-ignore
import AudioKeys from "audiokeys";

type keysProps = {
  engine: CustomPolySynth;
  osc1Type: string;
  osc2Type: string;
};

type ColorMap = {
  [key: string]: string;
};

const colorMap: ColorMap = {
  "sine-sine": "255, 0, 0",
  "sine-sawtooth": "255, 255, 0",
  "sawtooth-sine": "255, 255, 0",
  "sine-pulse": "0, 255, 0",
  "pulse-sine": "0, 255, 0",
  "sine-triangle": "0, 255, 255",
  "triangle-sine": "0, 255, 255",
  "sawtooth-sawtooth": "0, 255, 0",
  "sawtooth-pulse": "0, 255, 255",
  "pulse-sawtooth": "0, 255, 255",
  "sawtooth-triangle": "20, 120, 255",
  "triangle-sawtooth": "20, 120, 255",
  "pulse-pulse": "80, 80, 255",
  "pulse-triangle": "140, 40, 255",
  "triangle-pulse": "140, 40, 255",
  "triangle-triangle": "255, 0, 255",
};

export const Keys = ({ engine, osc1Type, osc2Type }: keysProps) => {
  const [notesPressed, setNotesPressed] = useState<number[]>([]);
  const [colorRGB, setColorRGB] = useState<string>("255, 0, 0");

  engine.keyboard.down((key: any) => {
    setNotesPressed([...notesPressed, key.note]);
  });

  engine.keyboard.up((key: any) => {
    setNotesPressed(notesPressed.filter((note) => note !== key.note));
  });

  const generateKeys = () => {
    const keys = [];
    const keyPattern = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
    ];
    for (let i = 0; i <= 83; i++) {
      keys.push({ note: i + 24, type: keyPattern[i % 12] ? "white" : "black" });
    }
    return keys;
  };

  const keys = useMemo(() => generateKeys(), []);

  const handleMouseDown = (note: number) => {
    setNotesPressed([...notesPressed, note]);
    engine.triggerAttack(note, Tone.now(), 1);
  };

  const handleMouseUp = (note: number) => {
    setNotesPressed(notesPressed.filter((n) => n !== note));
    engine.triggerRelease(note);
  };

  useEffect(() => {
    const key = `${osc1Type}-${osc2Type}`;
    setColorRGB(colorMap[key]);
  }, [osc1Type, osc2Type]);

  return (
    <div className={styles.wrapper}
    style={{ "--color-rgb": colorRGB } as React.CSSProperties}>
      <div className={styles.container}>
        <ul className={styles.keys}>
          {keys.map((k) => (
            <li
              key={k.note}
              onMouseDown={() => handleMouseDown(k.note)}
              onMouseUp={() => handleMouseUp(k.note)}
              className={`${styles.key} ${styles[k.type]}
            ${
              notesPressed.includes(k.note)
                ? k.type === "white"
                  ? styles.whitePressed
                  : styles.blackPressed
                : ""
            }
`}
              
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};
