"use client";

import { LFOTarget } from "@/lib/types/types";
import styles from "./Slider.module.css";
import { useDrag } from "@use-gesture/react";

type SliderProps = {
  key: number;
  lfoName: string;
  target: LFOTarget;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (target: LFOTarget, value: number) => void;
  handleDoubleClick: (target: LFOTarget) => void;
};

export const Slider = ({
  key,
  lfoName,
  target,
  value,
  min,
  max,
  step,
  handleDoubleClick,
  onChange
}: SliderProps) => {

  const adjustValueToStep = (value: number, step: number) => {
    const roundedSteps = Math.round((value - min) / step);
    return roundedSteps * step + min;
  };
  const updateValue = (value: number) => {
    let adjustedValue = adjustValueToStep(value, step);
    return Math.min(Math.max(adjustedValue, min), max);
  };

  const valueToPercent = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const percentToValue = (percent: number) => {
    return (percent / 100) * (max - min) + min;
  };

  const bind = useDrag(
    ({ delta }) => {
      const dragSensitivity = -0.3;
      let percentChange = delta[1] * dragSensitivity;
      let currentPercent = valueToPercent(value);
      let newPercent = Math.max(
        0,
        Math.min(100, currentPercent + percentChange)
      );
      let newValue = percentToValue(newPercent);

      newValue = updateValue(newValue);
      onChange(target, newValue);
    },
    {
      pointer: {
        keys: false,
      },
    }
  );

  return (
    <div {...bind()}
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
        style={{width: `${value * 100}%`}}
      ></span>
    </div>
  );
};
