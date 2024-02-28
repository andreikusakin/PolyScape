import React from "react";
import { useMemo } from "react";
import styles from "./Keys.module.css";

type keysProps = {
  colorRGB: string;
};

export const Keys = ({ colorRGB }: keysProps) => {
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
  console.log(keys);

  const handleMouseDown = (note: number) => {};

  const handleMouseUp = (note: number) => {};

  return (
    <div className={styles.wrapper}>
      <ul className={styles.container}>
        {keys.map((k) => (
          <li
            key={k.note}
            onMouseDown={() => handleMouseDown(k.note)}
            onMouseUp={() => handleMouseUp(k.note)}
            className={`${styles.key} ${styles[k.type]}`}
            style={{ '--color-rgb': colorRGB } as React.CSSProperties}
          ></li>
        ))}
      </ul>
    </div>
  );
};
