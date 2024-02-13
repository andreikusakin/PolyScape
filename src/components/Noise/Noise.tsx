import Knob from "../Knob/Knob";
import styles from "./Noise.module.css";
import { NoiseShape } from "../Shapes";
import CustomPolySynth from "@/lib/engines/CustomPolySynth";

type NoiseProps = {
  engine: CustomPolySynth | undefined;
  name: string;
  type: "white" | "pink" | "brown";
  setType: (type: "white" | "pink" | "brown") => void;
  volume: number;
  setVolume: (volume: number) => void;
};

export default function Noise({
  engine,
  name,
  type,
  setType,
  volume,
  setVolume,
}: NoiseProps) {
  const colorValue =
    type === "white" ? "#FFFFFF" : type === "pink" ? "#E859FF" : "#FF543D";

  const updateType = (type: "white" | "pink" | "brown") => {
    setType(type);
    engine?.voices.forEach((voice) => {
      voice.noise.type = type;
    });
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    engine?.LFO1.find((lfo) => lfo.target === "noise volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    })
    engine?.LFO2.find((lfo) => lfo.target === "noise volume")?.LFO.set({
      min: -70 + value,
      max: 12 + value,
    })
    engine?.voices.forEach((v) => (v.noise.volume.value = value))
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>
        <ul className={styles.types}>
          <li
            onClick={() => updateType("white")}
            className={type === "white" ? styles.selected : ""}
          >
            white
          </li>
          <li
            onClick={() => updateType("pink")}
            className={type === "pink" ? styles.selected : ""}
          >
            pink
          </li>
          <li
            onClick={() => updateType("brown")}
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
          exponent={1}
          label={"volume"}
          minValue={-70}
          maxValue={12}
          unit={"db"}
          currentValue={volume}
          step={0.5}
          onChange={updateVolume}
          radius={24}
          lfo={false}
          startingPoint={"middle"}
          interactive={true}
        />
      </div>
    </div>
  );
}
