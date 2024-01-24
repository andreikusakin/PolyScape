"use client";

import React, { useEffect, useState } from "react";
import styles from "./Knob.module.css";
import { useDrag } from "@use-gesture/react";
import Dial from "../Dial/Dial";

type KnobProps = {
  radius: number;
  label: string;
  lfo: false | 1 | 2;
  lfoPercent?: number;
  startingPoint: "beginning" | "middle";
  interactive?: boolean;
  minValue: number;
  maxValue: number;
  currentValue: number;
  step: number;
  updateValue?: (value: number) => void;
};

const Knob: React.FC<KnobProps> = ({
  radius,
  minValue,
  maxValue,
  currentValue,
  step,
  lfo,
  lfoPercent,
  startingPoint,
  label,
  interactive,
  updateValue,
}) => {
  const adjustToStep = (value: number) => Math.round(value / step) * step;

  const valueToPercent = (value: number) => {
    const adjustedValue = adjustToStep(value);
    return ((adjustedValue - minValue) / (maxValue - minValue)) * 100;
  };

  const percentToValue = (percent: number) => {
    const value = minValue + (percent / 100) * (maxValue - minValue);
    return adjustToStep(value);
  };

  const [percent, setPercent] = useState<number>(valueToPercent(currentValue));
  const [displayLabel, setDisplayLabel] = useState(label);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      setDisplayLabel(`${Math.round(currentValue)}`);
    } else {
      setDisplayLabel(label);
    }
  }, [isDragging, percent, label]);

  useEffect(() => {
    setPercent(valueToPercent(currentValue));
  }, [currentValue]);

  const bind = useDrag(
    ({ delta }) => {
      const dragSensitivity = -0.6;
      let newPercent = percent + delta[1] * dragSensitivity;
      newPercent = Math.max(0, Math.min(newPercent, 100));
      const newValue = percentToValue(newPercent);
      const newPercentAdjusted = valueToPercent(newValue);
      setPercent(newPercentAdjusted);
      if (updateValue) {
        updateValue(newValue);
      }
    },
    {
      pointer: {
        keys: false,
      },
    }
  );
  return (
    <div
      {...bind()}
      className={interactive ? styles.knob : styles.knobNotInteractive}
      onDoubleClick={() => updateValue && updateValue(0)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Dial
        radius={radius}
        percent={percent}
        lfo={lfo}
        lfoPercent={lfoPercent}
        startingPoint={startingPoint}
      />
      <div className={styles.label}>{displayLabel}</div>
    </div>
  );
};
export default Knob;
