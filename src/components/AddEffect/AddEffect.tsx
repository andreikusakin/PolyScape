import { BitCrusherImage } from "../BitCrusher/BitCrusherImage/BitCrusherImage";
import { ChorusImage } from "../Chorus/ChorusImage/ChorusImage";
import { DelayImage } from "../Delay/DelayImage/DelayImage";
import { DistortionIcon } from "../Distortion/DistortionIcon/DistortionIcon";
import { Rackets } from "../PingPongDelay/Rackets/Rackets";
import { Cube } from "../Reverb/Cube/Cube";
import styles from "./AddEffect.module.css";
import { IconX } from "@tabler/icons-react";

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
  },
  {
    name: "bitcrusher",
    component: <BitCrusherImage />,
  },
  {
    name: "delay",
    component: <DelayImage />,
  },
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
      <div
        onClick={() => setIsAddEffectOpen(false)}
        className={styles.close}
      >
        <IconX stroke={1} size={40} />
        <span>close</span>
      </div>
    </div>
  );
};
