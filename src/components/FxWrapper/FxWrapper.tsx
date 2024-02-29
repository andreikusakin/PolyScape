import styles from "./FxWrapper.module.css";
import { useState, useEffect } from "react";
import { Effect } from "@/lib/types/types";
import * as Tone from "tone/build/esm/index";

type FxWrapperProps = {
  effectName: string;
  children: React.ReactNode;
  effect: Tone.ToneAudioNode | undefined;
  currentWet: number;
  deleteFunction: () => void;
};

export const FxWrapper = ({
  effectName,
  children,
  effect,
  currentWet,
  deleteFunction
}: FxWrapperProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  useEffect(() => {
    
      if (isMuted) {
        effect?.set({ wet: 0 });
      } else {
        effect?.set({ wet: currentWet / 100 });
      }
    
  }, [isMuted]);
  return (
    <div className="relative">
      <div
        className={isMuted ? styles.container_bypass : styles.container}
        style={{
          boxShadow: `var(--${effectName}-border), inset 0 0 20px 3px rgb(0 0 0 / 50%), inset 0 0 5px 0 rgba(var(--${effectName}-rgb), 0.4`,
          background: `radial-gradient(
        150.32% 141.42% at 0% 0%,
        rgba(var(--${effectName}-rgb), 0.1) 0%,
        rgba(var(--${effectName}-secondary-rgb), 0.05) 100%
      )`,
        }}
      >
        <div className={styles.drag}>
          <div
            className={styles.dot}
            style={{ background: `rgba(var(--${effectName}-light), 0.8` }}
          ></div>
        </div>
        {children}
      </div>
      <div className={styles.delete} onClick={deleteFunction}></div>
      <div className={styles.bypass} onClick={() => setIsMuted(!isMuted)}></div>
    </div>
  );
};
