"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone/build/esm/index";
import styles from "./Knob.module.css";
import { useDrag } from "@use-gesture/react";
import Dial from "../Dial/Dial";
import { LFOTarget } from "@/lib/types/types";
import { useSynthSettingsStore } from "@/lib/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

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
  interactive?: boolean;
  minValue: number;
  maxValue: number;
  currentValue:
    | string
    | number
    | Tone.Unit.Frequency
    | Tone.FrequencyClass
    | Tone.Unit.Time;
  step: number;
  onChange: (value: any) => void;
  exponent?: number; 
  assignLFO?: (target: LFOTarget, lfo: 1 | 2) => void;
  sync?: boolean;
};

const Knob: React.FC<KnobProps> = React.memo(
  ({
    radius,
    minValue: initialMinValue, 
    maxValue: initialMaxValue, 
    currentValue: propCurrentValue, 
    step: initialStep,
    lfoAmount,
    lfoParameter,
    label,
    label2,
    unit,
    interactive = true, 
    onChange,
    exponent = 1,
    sync,
  }) => {
    const [displayLabel, setDisplayLabel] = useState<string>(label);
    const [displayLabel2, setDisplayLabel2] = useState(label2);
    const [isDragging, setIsDragging] = useState(false);

    const [derivedProps, setDerivedProps] = useState(() => {
      const cleanMinValue = Number(initialMinValue) || 0;
      const cleanMaxValue =
        Number(initialMaxValue) > cleanMinValue
          ? Number(initialMaxValue)
          : cleanMinValue + 1;
      const cleanStep = Math.abs(Number(initialStep)) || 0.01;

      if (sync) {
        const index = subdivisions.indexOf(propCurrentValue as string);
        return {
          minValue: 0,
          maxValue: subdivisions.length - 1,
          step: 1,
          currentValue: index === -1 ? 0 : index, 
        };
      }
      const initialNumValue = Number(propCurrentValue);
      const clampedInitialValue = isNaN(initialNumValue)
        ? cleanMinValue 
        : Math.min(Math.max(initialNumValue, cleanMinValue), cleanMaxValue);

      return {
        minValue: cleanMinValue,
        maxValue: cleanMaxValue,
        step: cleanStep,
        currentValue: clampedInitialValue,
      };
    });

    useEffect(() => {
      const cleanMinValue = Number(initialMinValue) || 0;
      const cleanMaxValue =
        Number(initialMaxValue) > cleanMinValue
          ? Number(initialMaxValue)
          : cleanMinValue + 1;
      const cleanStep = Math.abs(Number(initialStep)) || 0.01;

      if (sync) {
        const index = subdivisions.indexOf(propCurrentValue as string);
        setDerivedProps({
          minValue: 0,
          maxValue: subdivisions.length - 1,
          step: 1,
          currentValue: index === -1 ? 0 : index,
        });
      } else {
        const initialNumValue = Number(propCurrentValue);
        const clampedInitialValue = isNaN(initialNumValue)
          ? cleanMinValue
          : Math.min(Math.max(initialNumValue, cleanMinValue), cleanMaxValue);
        setDerivedProps({
          minValue: cleanMinValue,
          maxValue: cleanMaxValue,
          step: cleanStep,
          currentValue: clampedInitialValue,
        });
      }
    }, [
      sync,
      propCurrentValue,
      initialMinValue,
      initialMaxValue,
      initialStep,
    ]);

    const { minValue, maxValue, step, currentValue } = derivedProps;

    const valueToPercent = (value: number): number => {
      if (isNaN(value)) {
        console.warn("Knob: valueToPercent received NaN input");
        return 0; 
      }
      if (maxValue === minValue) return 0; 

      const clampedValue = Math.min(Math.max(value, minValue), maxValue);
      const normalizedValue =
        (clampedValue - minValue) / (maxValue - minValue);

      const base = Math.max(0, normalizedValue);
      const safeExponent = exponent === 0 ? 1 : exponent;
      const result = Math.pow(base, 1 / safeExponent) * 100;

      return isNaN(result) ? 0 : result;
    };

    const percentToValue = (percent: number): number => {
      if (isNaN(percent)) {
        console.warn("Knob: percentToValue received NaN input");
        return minValue; 
      }
      if (maxValue === minValue) return minValue;

      const clampedPercent = Math.min(Math.max(percent, 0), 100);
      const normalizedPercent = clampedPercent / 100;
      const safeExponent = exponent === 0 ? 1 : exponent;
      const result =
        Math.pow(normalizedPercent, safeExponent) * (maxValue - minValue) +
        minValue;

      return isNaN(result) ? minValue : result;
    };

    const adjustValueToStep = (value: number): number => {
      if (isNaN(value)) {
        console.warn("Knob: adjustValueToStep received NaN input");
        return minValue; 
      }
      if (step <= 0 || isNaN(step)) {
        return Math.min(Math.max(value, minValue), maxValue);
      }

      const stepsFromMin = Math.round((value - minValue) / step);
      let adjusted = stepsFromMin * step + minValue;

      const finalClamped = Math.min(Math.max(adjusted, minValue), maxValue);

      return isNaN(finalClamped) ? minValue : finalClamped;
    };

    const { isSelectingLFO, assignLFO } = useSynthSettingsStore(
      useShallow((state) => ({
        isSelectingLFO: state.isSelectingLFO,
        assignLFO: state.assignLFOToTarget,
      }))
    );

    const [percent, setPercent] = useState<number>(() =>
      valueToPercent(currentValue)
    );
    useEffect(() => {
      setPercent(valueToPercent(currentValue));
    }, [currentValue, exponent, minValue, maxValue]); 

    useEffect(() => {
      if (isDragging) {
        if (sync) {
          const index = Math.round(currentValue);
          if (index >= 0 && index < subdivisions.length) {
            setDisplayLabel(subdivisions[index]);
          } else {
            setDisplayLabel("N/A"); 
          }
          setDisplayLabel2("");
        } else {
          const fixedDigits =
            step < 1 ? step.toString().split(".")[1]?.length || 2 : 0;
          const displayValue = isNaN(currentValue)
            ? "N/A"
            : currentValue.toFixed(fixedDigits);
          setDisplayLabel(`${displayValue} ${unit ? unit : ""}`);
          setDisplayLabel2("");
        }
      } else {
        setDisplayLabel(label);
        setDisplayLabel2(label2);
      }
    }, [
      isDragging,
      currentValue,
      label,
      unit,
      label2,
      sync,
      step, 
    ]);

    const bind = useDrag(
      ({ movement: [, my], first, last, memo }) => {
        if (!interactive) return; 

        const startPercent = first
          ? valueToPercent(currentValue) 
          : typeof memo === "number" && !isNaN(memo)
          ? memo 
          : valueToPercent(currentValue); 

        const dragSensitivity = -0.3; 
        const percentChange = my * dragSensitivity;

        if (isNaN(startPercent) || isNaN(percentChange)) {
          console.error("Knob: Invalid values in drag calculation", {
            startPercent,
            percentChange,
          });
          return startPercent;
        }

        const targetPercent = Math.max(
          0,
          Math.min(100, startPercent + percentChange)
        );

        const rawValue = percentToValue(targetPercent);

        const snappedValue = adjustValueToStep(rawValue);

        if (isNaN(snappedValue)) {
          console.error("Knob: Snapped value resulted in NaN", {
            targetPercent,
            rawValue,
          });
          return startPercent;
        }

        let finalValue: string | number;
        if (sync) {
          const index = Math.round(snappedValue);
          if (index >= 0 && index < subdivisions.length) {
            finalValue = subdivisions[index];
          } else {
            console.warn(
              `Knob (sync): Snapped value ${snappedValue} out of bounds for subdivisions.`
            );
            finalValue = subdivisions[0];
          }
        } else {
          finalValue = snappedValue;
        }

        const valueChanged = sync
          ? finalValue !== propCurrentValue
          : Number(finalValue) !== Number(propCurrentValue);

        if (valueChanged) {
          onChange(finalValue);
        }

        const newPercent = valueToPercent(snappedValue);
        if (!isNaN(newPercent)) {
          setPercent(newPercent);
        }

        if (first) setIsDragging(true);
        if (last) setIsDragging(false);

        return startPercent;
      },
      {
        pointer: { keys: false },
        onPointerDown: () => interactive && setIsDragging(true),
        onPointerUp: () => interactive && setIsDragging(false),
        preventScroll: true,
        axis: "y",
      }
    );

    const handleDoubleClick = () => {
      if (interactive && onChange) {
        let resetValue: number | string;
        if (sync) {
          resetValue = subdivisions[0]; 
        } else {
          const zeroIsInRange = minValue <= 0 && maxValue >= 0;
          const numericReset = zeroIsInRange ? 0 : minValue;
          resetValue = adjustValueToStep(numericReset);
        }

        const isNumericValid = typeof resetValue === 'number' && !isNaN(resetValue);
        const isStringValid = typeof resetValue === 'string';

        if (isNumericValid || isStringValid) {
          onChange(resetValue);
          const percentValue = sync ? 0 : Number(resetValue);
          const resetPercent = valueToPercent(percentValue);
          if (!isNaN(resetPercent)) {
            setPercent(resetPercent);
          }
        } else {
          console.error("Knob: Double-click reset resulted in invalid value", { resetValue });
        }
      }
    };

    const handleClick = () => {
      if (interactive && lfoParameter && isSelectingLFO && assignLFO) {
        const numericCurrentValue = Number(currentValue);
        if (!isNaN(numericCurrentValue)) {
          assignLFO(lfoParameter, numericCurrentValue);
        } else {
          console.warn("Knob: Cannot assign LFO, current value is NaN");
        }
      }
    };

    return (
      <div
        {...bind()}
        className={interactive ? styles.knob : styles.knobNotInteractive}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{ touchAction: "none" }}
      >
        <Dial
          radius={radius}
          percent={isNaN(percent) ? 0 : percent}
          lfoAmount={lfoAmount}
          isSelectingLFO={lfoParameter && isSelectingLFO}
        />
        {label && (
          <div className={styles.labels}>
            <span>{displayLabel}</span>
            {displayLabel2 && <span>{displayLabel2}</span>}
          </div>
        )}
      </div>
    );
  }
);

export default Knob;
