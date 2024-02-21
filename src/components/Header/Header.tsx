import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./Header.module.css";
import { WebMidi } from "webmidi";

export const Header = () => {
  WebMidi.enable();
  const midiInput = WebMidi.inputs;
  console.log(midiInput);
  return (
    <SectionWrapper>
      <div className={styles.container}>
        <div className={styles.midi}>
          {midiInput.map((input, i) => (
            <div key={i}>{input.name}</div>
          ))}
        </div>
        <div className={styles.bpm}>bpm</div>
        <div className={styles.fx}>fx</div>
      </div>
    </SectionWrapper>
  );
};
