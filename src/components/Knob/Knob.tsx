"use client";

import React from "react";
import styles from "./Knob.module.css";
import { start } from "repl";

type DialProps = {
  radius: number;
  percent: number;
  dialColor: string;
  dialPercentColor: string;
  startingPoint: "beginning" | "middle";
};

interface KnobProps extends DialProps {
  name: string;
}

const Dial: React.FC<DialProps> = ({
  radius,
  percent,
  dialColor,
  dialPercentColor,
  startingPoint,
}) => {
  const strokeWidth = radius * 0.1;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const arc = circumference * (270 / 360);
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(135, ${radius}, ${radius})`;

  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  const offset = arc - (percentNormalized / 100) * arc;

  
  
  
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke={dialColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        transform={transform}
      />
      <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke={dialPercentColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        transform={transform}
      /> 
      {/* <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke={dialPercentColor}
        strokeWidth={strokeWidth}
        strokeDasharray="2 200"
        strokeDashoffset={offset}
        transform="rotate(280, 24, 24)"
      />  */}
     
    
    </svg>
  );
};

const Knob: React.FC<KnobProps> = ({
  radius,
  percent = 50,
  dialColor,
  dialPercentColor,
  startingPoint,
  name
}) => {
  const strokeWidth = radius * 0.1;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const arc = circumference * (270 / 360);
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(135, ${radius}, ${radius})`;

  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  const offset = arc - (percentNormalized / 100) * arc;
  return (
    <div>
      <div className={styles.circle}>
        <Dial
          radius={radius}
          percent={percent}
          dialColor={dialColor}
          dialPercentColor={dialPercentColor}
          startingPoint={startingPoint}
        />
        <div className={styles.name}>{name.toUpperCase()}</div>
      </div>
      
    </div>
  );
};

export default Knob;
