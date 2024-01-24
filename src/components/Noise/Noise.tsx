import Knob from "../Knob/Knob";
import styles from "./Noise.module.css";
import { NoiseShape } from "../Shapes";

type NoiseProps = {
  name: string;
  type: "white" | "pink" | "brown";
  setType: (type: "white" | "pink" | "brown") => void;
  volume: number;
  setVolume: (volume: number) => void;
};

export default function Noise({
  name,
  type,
  setType,
  volume,
  setVolume,
}: NoiseProps) {
  const colorValue =
    type === "white" ? "#FFFFFF" : type === "pink" ? "#E859FF" : "#FF543D";
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>
        <ul className={styles.types}>
          <li
            onClick={() => setType("white")}
            className={type === "white" ? styles.selected : ""}
          >
            white
          </li>
          <li
            onClick={() => setType("pink")}
            className={type === "pink" ? styles.selected : ""}
          >
            pink
          </li>
          <li
            onClick={() => setType("brown")}
            className={type === "brown" ? styles.selected : ""}
          >
            red
          </li>
        </ul>
        <div className={styles.waveform}>
          <div className={styles.waveformAnimation}>
            <NoiseShape color={colorValue} />
          </div>
        </div>
        <Knob
          label={"volume"}
          minValue={-96}
          maxValue={6}
          currentValue={volume}
          step={0.5}
          updateValue={setVolume}
          radius={24}
          lfo={false}
          startingPoint={"middle"}
          interactive={true}
        />
      </div>
    </div>
  );
}