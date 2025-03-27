"use client";

import React, { useState } from "react";
import * as Tone from "tone/build/esm/index";
import { useMemo } from "react";
import styles from "./Keys.module.css";
import { useShallow } from "zustand/react/shallow";
import { useSynthEngineStore } from "@/lib/store/settingsStore";
import { useUiColorRGB } from "@/lib/store/uiStore";
import { useUiStore } from "@/lib/store/uiStore";

export const Keys = React.memo(() => {
  const engine = useSynthEngineStore((state) => state.synthEngine);
  const [notesPressed, setNotesPressed] = useState<number[]>([]);
  // const [colorRGB, setColorRGB] = useState<string>("255, 0, 0");
  const { isCustomColor, customColor, keyboardSize } = useUiStore(
    useShallow((state) => ({
      isCustomColor: state.isCustomColor,
      customColor: state.customColor,
      keyboardSize: state.keyboardSize,
    }))
  );
  
  const colorRGB = useUiColorRGB();
  engine?.keyboard.down((key: any) => {
    setNotesPressed([...notesPressed, key.note]);
  });

  engine?.keyboard.up((key: any) => {
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
    engine?.triggerAttack(note, Tone.now(), 1);
  };

  const handleMouseUp = (note: number) => {
    setNotesPressed(notesPressed.filter((n) => n !== note));
    engine?.triggerRelease(note);
  };

  return (
    <div
      className={styles.wrapper}
      style={
        {
          "--color-rgb": isCustomColor ? customColor : colorRGB,
          fontSize: `${keyboardSize}em`,
        } as React.CSSProperties
      }
    >
      <div className={styles.container}>
        <ul className={styles.keys}>
          {keys.map((k) => (
            <li
              key={k.note}
              onTouchStart={() => handleMouseDown(k.note)}
              onTouchEnd={() => handleMouseUp(k.note)}
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
              id={k.type === "white" ? "white" : "black"}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
});
