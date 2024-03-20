import styles from "./Cube.module.css";
import localFont from "next/font/local";

const kodeMono = localFont({ src: "./../../../lib/fonts/KodeMono.ttf" });

export const Cube = () => {
  return (
    <div className={styles.container}>
      <div className={styles.cube}>
        <div className={`${styles.face} ${styles.top}`}></div>
        <div className={`${styles.text} ${kodeMono.className}`}>
          <span>rev</span>
          <span>erb</span>
        </div>
        <div className={`${styles.face} ${styles.bottom}`}></div>
        <div className={`${styles.face} ${styles.left}`}></div>
        <div className={`${styles.face} ${styles.right}`}></div>
        <div className={`${styles.face} ${styles.front}`}></div>
        <div className={`${styles.face} ${styles.back}`}></div>
      </div>
    </div>
  );
};
