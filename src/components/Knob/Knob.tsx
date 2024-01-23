"use client";

import React, { useEffect, useState } from "react";
import styles from "./Knob.module.css";
import { useDrag } from "@use-gesture/react";

type DialProps = {
  radius: number;
  percent: number;
  lfo: false | 1 | 2;
  lfoPercent?: number;
  startingPoint: "beginning" | "middle";
};

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

const Dial: React.FC<DialProps> = ({
  radius,
  percent,
  lfo,
  lfoPercent,
  startingPoint,
}) => {
  const strokeWidth = radius * 0.1;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const arc = circumference * (270 / 360);
  const dashArray = `${arc} ${circumference}`;
  const outerInnerRadius = innerRadius * 1.22;
  const outerCircumference = 2 * Math.PI * outerInnerRadius;
  const outerArc = outerCircumference * (270 / 360);
  const outerDashArray = `${outerArc} ${outerCircumference}`;
  const transform = `rotate(135, ${radius}, ${radius})`;
  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  let lfoOffset;
  if (lfoPercent) {
    const lfoPercentNormalized = Math.min(Math.max(lfoPercent, 0), 100);
    lfoOffset = arc - (lfoPercentNormalized / 100) * arc;
  }
  const offset = arc - (percentNormalized / 100) * arc;

  return (
    <svg height={radius * 2.44} width={radius * 2.44}>
      <circle
        cx={radius}
        cy={radius / 1.44}
        fill="transparent"
        r={innerRadius}
        stroke="rgba(255,255,255, 0.3)"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        transform={transform}
      />
      <circle
        cx={radius}
        cy={radius / 1.44}
        fill="transparent"
        r={innerRadius}
        stroke="rgba(255,255,255, 0.95)"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        transform={transform}
      />
      {lfo ? (
        <circle
          cx={radius}
          cy={radius / 1.44}
          fill="transparent"
          r={outerInnerRadius}
          stroke={
            lfo === 1 ? "rgba(255,235,132, 0.95)" : "rgba(255,132,132, 0.95)"
          }
          strokeWidth={strokeWidth}
          strokeDasharray={outerDashArray}
          strokeDashoffset={lfoOffset}
          transform={transform}
        />
      ) : null}
    </svg>
  );
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
