import { LFOTarget } from "@/lib/types/types";
import styles from "./Slider.module.css";

type SliderProps = {
  key: number;
  lfoName: string;
  target: string;
  value: number;
  min: number;
  max: number;
  handleDoubleClick: (target: LFOTarget) => void;
};

export const Slider = ({
  key,
  lfoName,
  target,
  value,
  min,
  max,
  handleDoubleClick,
}: SliderProps) => {
  return (
    <div
      className={[
        styles.container,
        lfoName === "lfo1" ? styles.containerLFO1 : styles.containerLFO2,
      ].join(" ")}
      key={key}
      onDoubleClick={() => handleDoubleClick(target)}
    >
      <label
        className={[
          styles.label,
          lfoName === "lfo1" ? styles.labelLFO1 : styles.labelLFO2,
        ].join(" ")}
      >
        {target}
      </label>
      <span
        className={[
          styles.track,
          lfoName === "lfo1" ? styles.trackLFO1 : styles.trackLFO2,
        ].join(" ")}
      ></span>
    </div>
  );
};
