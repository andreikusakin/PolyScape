import { useEffect, useState } from "react";
import styles from "./BitCrusherImage.module.css";
import localFont from "next/font/local";

const workbench = localFont({ src: "./Workbench-Regular.ttf" });
const kodeMono = localFont({ src: "./../../../lib/fonts/KodeMono.ttf" });

export const BitCrusherImage = () => {
  const [binaryNumbers, setBinaryNumbers] = useState([[0, 1, 1, 0, 0, 0, 1, 0], [0, 1, 1, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 0, 0, 1]]);


  const generateRandomBinary = () => {
    const newBinaryNumbers = Array.from({ length: 3 }, () =>
      Array.from({ length: 8 }, () => Math.round(Math.random()))
    );
    setBinaryNumbers(newBinaryNumbers);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomBinary();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${workbench.className} ${styles.container}`}>
      <div className={styles.row}>
        <h3>bit</h3>
        <div className={`${styles.binary_numbers} ${kodeMono.className}`}>
          <div>{binaryNumbers[0]}</div>
          <div>{binaryNumbers[1]}</div>
          <div>{binaryNumbers[2]}</div>
        </div>
      </div>

      <div className={styles.row}>
        <h3>crusher</h3>
        <span></span>
      </div>
    </div>
  );
};
