import { ChorusImage } from "../Chorus/ChorusImage/ChorusImage";
import { DistortionIcon } from "../Distortion/DistortionIcon/DistortionIcon";
import { Rackets } from "../PingPongDelay/Rackets/Rackets";
import { Cube } from "../Reverb/Cube/Cube";
import styles from "./AddEffect.module.css";

type AddEffectProps = {
  addNewEffect: (type: string) => void;
  setIsAddEffectOpen: (isOpen: boolean) => void;
};

const effectTypes = [
  {
    name: "reverb",
    component: <Cube />,
  },
  {
    name: "ping pong delay",
    component: <Rackets />,
  },
  {
    name: "distortion",
    component: <DistortionIcon />,
  },
  {
    name: "chorus",
    component: <ChorusImage />,
  }
];

export const AddEffect = ({
  addNewEffect,
  setIsAddEffectOpen,
}: AddEffectProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.effect_container}>
        {effectTypes.map((effect, index) => (
          <div
            className={styles.effect}
            key={index}
            onClick={() => {
              addNewEffect(effect.name);
              setIsAddEffectOpen(false);
            }}
          >
            {effect.component}
            <div className={styles.effect_name}>{effect.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
