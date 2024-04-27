import styles from "./Dial.module.css";

type DialProps = {
  radius: number;
  percent: number;
  lfo?: 1 | 2;
  lfoAmount?: number;
  // startingPoint: "beginning" | "middle";
  isSelectingLFO?: false | 1 | 2;
};

const Dial: React.FC<DialProps> = ({
  radius,
  percent,
  lfo,
  lfoAmount,
  // startingPoint,
  isSelectingLFO,
}) => {
  
  const strokeWidth = radius >= 24 ? radius * 0.1 : radius * 0.25;
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
  if (lfoAmount) {
    const lfoPercentNormalized = Math.min(Math.max(lfoAmount, 0), 100);
    lfoOffset = arc - (lfoPercentNormalized / 100) * arc;
  }
  const offset = arc - (percentNormalized / 100) * arc;
  return (
    <div className={styles.dial}>
      {isSelectingLFO && <div className={`${styles.targetSelecting} ${isSelectingLFO === 1 ? styles.lfo1 : isSelectingLFO === 2 ? styles.lfo2 : null }`}></div>}
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
        {lfoAmount ? (
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
    </div>
  );
};

export default Dial;
