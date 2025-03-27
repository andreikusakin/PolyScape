'use client'
import styles from "./Keyboard.module.css";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import { Keys } from "./Keys/Keys";
import { useEffect, useRef } from "react";

export const Keyboard = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  return (
    <div className={styles.wrapper} ref={containerRef}>
      <SectionWrapper>
        <div className={styles.container}>
          <Keys />
        </div>
      </SectionWrapper>
    </div>
  );
};
