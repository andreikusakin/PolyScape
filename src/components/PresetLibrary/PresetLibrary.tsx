import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";
import { IconSearch } from "@tabler/icons-react";
import styles from "./PresetLibrary.module.css";
import {
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import { useUiColorRGB } from "@/lib/store/uiStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const types = ["all", "bass", "lead", "pad", "fx", "keys", "drums", "misc"];

export const PresetLibrary = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState("all");
  const presets = usePresetLibraryStore(useShallow((state) => state.presetLibrary));
  const selectedPreset = usePresetLibraryStore(useShallow((state) => state.selectedPreset));
  const colorRGB = useUiColorRGB();

  const filteredPresets = presets?.filter((p) => {
    return (type === "all" || p.type.toLowerCase() === type.toLowerCase()) && p.name.toLowerCase().includes(input.toLowerCase());
  });


  return (
    <div className="fixed mt-4 flex justify-center left-0 top-10 w-full pointer-events-none">
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
              onFocus={() => setType("all")}
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
              {filteredPresets.map((p) => (
                <tr
                  key={p.id}
                  className={
                    selectedPreset === p.id ? styles.selected : ""
                  } 
                  onClick={() => {
                    useSynthSettingsStore.getState().setAllParamsFromPreset(p.settings);
                    usePresetLibraryStore.getState().setSelectedPreset(p.id);
                  }}
                >
                  <td>{p.name}</td>
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
