"use client";

import React, { use, useEffect, useState } from "react";
import styles from "./Knob.module.css";
import { useDrag } from "@use-gesture/react";
import Dial from "../Dial/Dial";
import { LFOTarget } from "@/lib/types/types";

type KnobProps = {
  radius: number;
  label: string;
  label2?: string;
  unit?: string;
  isSelectingLFO?: false | 1 | 2;
  lfoParameter?: LFOTarget;
  lfoAmount?: number;
  startingPoint: "beginning" | "middle";
  interactive?: boolean;
  minValue: number;
  maxValue: number;
  currentValue: number;
  step: number;
  onChange?: (value: number) => void;
  exponent: number;
  assignLFO?: (target: LFOTarget, lfo: 1 | 2) => void;
};

const Knob: React.FC<KnobProps> = ({
  radius,
  minValue,
  maxValue,
  currentValue,
  step,
  lfoAmount,
  lfoParameter,
  startingPoint,
  label,
  label2,
  unit,
  interactive,
  onChange,
  exponent,
  isSelectingLFO,
  assignLFO
}) => {
  const adjustValueToStep = (value: number, step: number) => {
    const roundedSteps = Math.round((value - minValue) / step);
    return roundedSteps * step + minValue;
  };
  const updateValue = (value: number) => {
    // let adjustedValue;
    // if (exponent >= 1) {
    //   adjustedValue = value ** exponent;
    // }
    // else {
    //   adjustedValue = Math.log(value);
    // }

    // return Math.min(Math.max(adjustedValue, minValue), maxValue);
    let adjustedValue = adjustValueToStep(value, step);
    return Math.min(Math.max(adjustedValue, minValue), maxValue);
  };

  const valueToPercent = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const percentToValue = (percent: number) => {
    return (percent / 100) * (maxValue - minValue) + minValue;
  };

  const [percent, setPercent] = useState<number>(valueToPercent(currentValue));
  const [displayLabel, setDisplayLabel] = useState<string>(label);
  const [displayLabel2, setDisplayLabel2] = useState(label2);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const newPercent = valueToPercent(currentValue);
    setPercent(newPercent);
  }, [currentValue]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      setDisplayLabel(`${currentValue.toFixed(2)} ${unit ? unit : ""}`);
      setDisplayLabel2("");
    } else {
      setDisplayLabel(label);
      setDisplayLabel2(label2);
    }
  }, [isDragging, currentValue, label, unit]);

  const bind = useDrag(
    ({ delta }) => {
      const dragSensitivity = -0.3;
      let percentChange = delta[1] * dragSensitivity;
      let currentPercent = valueToPercent(currentValue);
      let newPercent = Math.max(
        0,
        Math.min(100, currentPercent + percentChange)
      );
      let newValue = percentToValue(newPercent);

      newValue = updateValue(newValue);

      setPercent(valueToPercent(newValue));
      if (onChange) {
        onChange(newValue);
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
      onClick={lfoParameter && isSelectingLFO ? () => assignLFO && assignLFO(lfoParameter, isSelectingLFO, currentValue) : undefined}
      {...bind()}
      className={interactive ? styles.knob : styles.knobNotInteractive}
      onDoubleClick={() => onChange && onChange(0)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {" "}
      <Dial
        radius={radius}
        percent={percent}
        // lfo={lfo}
        lfoAmount={lfoAmount}
        startingPoint={startingPoint}
        isSelectingLFO={isSelectingLFO}
      />
      <div className={styles.labels}>
        <span>{displayLabel}</span>
        <span>{displayLabel2}</span>
      </div>
    </div>
  );
};
export default Knob;
