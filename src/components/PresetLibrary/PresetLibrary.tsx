import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";
import { SectionWrapper } from "../SectionWrapper/SectionWrapper";
import styles from "./PresetLibrary.module.css";
import {
  useSynthSettingsStore,
  useWaveformColor,
} from "@/lib/store/settingsStore";

export const PresetLibrary = () => {
  const presets = usePresetLibraryStore((state) => state.presetLibrary);
  const colorRGB = useWaveformColor();
  const currentPresetName = useSynthSettingsStore((state) => state.presetName);
  console.log("RERENDER PRESET LIBRARY")
  return (
    <div className="fixed mt-4 flex justify-center left-0 w-full pointer-events-none">
      <div className={styles.wrapper}>
        <div
          className={styles.container}
          style={{ "--waveform-color": colorRGB } as React.CSSProperties}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((p, i) => (
                <tr
                  key={i}
                  className={
                    currentPresetName === p.presetName ? styles.selected : ""
                  }
                >
                  <td>{p.presetName}</td>
                  <td>{p.type}</td>
                  <td>{p.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.description}>
            <h6>Description</h6>
            <p>Lorem Ipsum random textLorem Ipsum random textLorem Ipsum random textLorem Ipsum random Lorem Ipsum random textLorem Ipsum random textLorem Ipsum random textLorem Ipsum random textLorem Ipsum random textLorem Ipsum random texttextLorem Ipsum random textLorem Ipsum random textLorem Ipsum random text</p>
          </div>
        </div>
      </div>
    </div>
  );
};
