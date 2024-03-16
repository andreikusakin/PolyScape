import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";
import { IconSearch } from "@tabler/icons-react";
import styles from "./PresetLibrary.module.css";
import {
  useSynthSettingsStore,
  useWaveformColor,
} from "@/lib/store/settingsStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const types = ["All", "Bass", "Lead", "Pad", "FX", "Keys", "Drums"];

export const PresetLibrary = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState("All");
  const presets = usePresetLibraryStore(useShallow((state) => state.presetLibrary));
  const colorRGB = useWaveformColor();
  const currentPresetName = useSynthSettingsStore(useShallow((state) => state.presetName));
  console.log("RERENDER PRESET LIBRARY");
  return (
    <div className="fixed mt-4 flex justify-center left-0 w-full pointer-events-none">
      <div
        className={styles.wrapper}
        style={{ "--waveform-color": colorRGB } as React.CSSProperties}
      >
        <div className={styles.search_container}>
          <h2>Preset Library</h2>
          <div className={styles.search}>
            <div className={styles.search_icon}>
              <IconSearch stroke={1} size={18} />
            </div>
            <input
              type="text"
              placeholder="Search Presets"
              className={styles.search_input}
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            {input && <div 
              style={{
                cursor: "pointer",
                paddingTop: "2px",
              }}
             onClick={() => setInput("")}
            >Clear All</div>}
            
          </div>
        </div>
        <div className={styles.types}>
          {types.map((t) => (
            <button key={t}
            className={type === t ? styles.selected_type : styles.type}
            onClick={() => setType(t)}
            >{t}</button>
          ))}
        </div>
        <div className={styles.container}>
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
            <p>
              Lorem Ipsum random textLorem Ipsum random textLorem Ipsum random
              textLorem Ipsum random Lorem Ipsum random textLorem Ipsum random
              textLorem Ipsum random textLorem Ipsum random textLorem Ipsum
              random textLorem Ipsum random texttextLorem Ipsum random textLorem
              Ipsum random textLorem Ipsum random text
            </p>  
          </div>
        </div>
      </div>
    </div>
  );
};
