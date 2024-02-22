"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone/build/esm/index";
import styles from "./Knob.module.css";
import { useDrag } from "@use-gesture/react";
import Dial from "../Dial/Dial";
import { LFOTarget } from "@/lib/types/types";

// knob like in jss  

const subdivisions = [
  "1m",
  "1n",
  "1n.",
  "2n",
  "2n.",
  "2t",
  "4n",
  "4n.",
  "4t",
  "8n",
  "8n.",
  "8t",
  "16n",
  "16n.",
  "16t",
  "32n",
  "32n.",
  "32t",
  "64n",
  "64n.",
  "64t",
  "128n",
  "128n.",
  "128t",
  "256n",
  "256n.",
  "256t",
];

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
  currentValue: string | number | Tone.Unit.Frequency | Tone.FrequencyClass;
  step: number;
  onChange: (value: number | string) => void;
  exponent: number;
  assignLFO?: (target: LFOTarget, lfo: 1 | 2) => void;
  sync?: boolean;
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
  assignLFO,
  sync,
}) => {

    if (sync) {
      step = 1;
      minValue = 0;
      maxValue = subdivisions.length - 1;
      currentValue = subdivisions.indexOf(currentValue as string);
    }

  

  const adjustValueToStep = (value: number, step: number) => {
    const roundedSteps = Math.round((value - minValue) / step);
    return roundedSteps * step + minValue;
  };
  const updateValue = (value: number) => {
    let adjustedValue = adjustValueToStep(value, step);
    return Math.min(Math.max(adjustedValue, minValue), maxValue);
  };

  const valueToPercent = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const percentToValue = (percent: number) => {
    return (percent / 100) * (maxValue - minValue) + minValue;
  };

  const [percent, setPercent] = useState<number>(valueToPercent(Number(currentValue)));
  const [displayLabel, setDisplayLabel] = useState<string>(label);
  const [displayLabel2, setDisplayLabel2] = useState(label2);
  const [isDragging, setIsDragging] = useState(false);
  const [subdivisionIndex, setSubdivisionIndex] = useState<number>(0);

  useEffect(() => {
    const newPercent = valueToPercent(Number(currentValue));
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
      if (sync) {
        setDisplayLabel(subdivisions[subdivisionIndex]);
        setDisplayLabel2("");
      } else {
        setDisplayLabel(`${Number(currentValue).toFixed(2)} ${unit ? unit : ""}`);
        setDisplayLabel2("");
      }
    } else {
      setDisplayLabel(label);
      setDisplayLabel2(label2);
    }
  }, [isDragging, currentValue, label, unit, subdivisionIndex]);

  const bind = useDrag(
    ({ delta }) => {
      if (!sync) {
        const dragSensitivity = -0.3;
        let percentChange = delta[1] * dragSensitivity;
        let currentPercent = valueToPercent(Number(currentValue));
        let newPercent = Math.max(
          0,
          Math.min(100, currentPercent + percentChange)
        );
        let newValue = percentToValue(newPercent);

        newValue = updateValue(newValue);
          console.log("newValue", newValue);
        setPercent(valueToPercent(newValue));
        if (onChange) {
          onChange(newValue);
        }
      } else {
        const dragSensitivity = -0.3;
        let percentChange = delta[1] * dragSensitivity;
        let currentPercent = valueToPercent(Number(currentValue));
        let newPercent = Math.max(
          0,
          Math.min(100, currentPercent + percentChange)
        );
        let newIndex = percentToValue(newPercent);

        newIndex = updateValue(newIndex);
          setSubdivisionIndex(newIndex);
        setPercent(valueToPercent(newIndex));

        console.log("newIndex", newIndex);
        if (onChange) {
          onChange(subdivisions[newIndex]);
        }
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
      onClick={
        lfoParameter && isSelectingLFO
          ? () =>
              assignLFO && assignLFO(lfoParameter, isSelectingLFO, currentValue)
          : undefined
      }
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
