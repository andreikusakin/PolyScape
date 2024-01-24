"use client";

import React, { useEffect, useState } from "react";
import styles from "./Knob.module.css";
import { useDrag } from "@use-gesture/react";
import Dial from "../Dial/Dial";

type KnobProps = {
  radius: number;
  label: string;
  label2?: string;
  unit?: string;
  lfo: false | 1 | 2;
  lfoTarget?: "string";
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
  lfoTarget,
  startingPoint,
  label,
  label2,
  unit,
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
  const [displayLabel, setDisplayLabel] = useState<string>(label);
  const [displayLabel2, setDisplayLabel2] = useState(label2);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      setDisplayLabel(`${Math.round(currentValue)} ${unit ? unit : ""}`);
      setDisplayLabel2("")
    } else {
      setDisplayLabel(label);
      setDisplayLabel2(label2);
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
      <div className={styles.labels}><span>{displayLabel}</span><span>{displayLabel2}</span></div>
    </div>
  );
};
export default Knob;
