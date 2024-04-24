import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";
import { IconSearch, IconTrashX, IconShare3 } from "@tabler/icons-react";
import styles from "./PresetLibrary.module.css";
import { useSynthEngineStore, useSynthSettingsStore } from "@/lib/store/settingsStore";
import { useUiColorRGB } from "@/lib/store/uiStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const types = ["all", "bass", "lead", "pad", "fx", "keys", "drums", "misc"];

export const PresetLibrary = () => {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const {polySynth} = useSynthEngineStore((state) => state.synthEngine);
  const presets = usePresetLibraryStore(
    useShallow((state) => state.presetLibrary)
  );

  const { currentPreset, setCurrentPreset } = usePresetLibraryStore(
    (state) => ({
      currentPreset: state.currentPreset,
      setCurrentPreset: state.setCurrentPreset,
    })
  );
  const {
    presetLibrary,
    setPresetLibrary,
    selectedPreset,
    setSelectedPreset,
    deletePresetFromLibrary,
  } = usePresetLibraryStore((state) => ({
    selectedPreset: state.selectedPreset,
    presetLibrary: state.presetLibrary,
    setPresetLibrary: state.setPresetLibrary,
    setSelectedPreset: state.setSelectedPreset,
    deletePresetFromLibrary: state.deletePresetFromLibrary,
  }));
  const { setAllParamsFromPreset } = useSynthSettingsStore((state) => ({
    setAllParamsFromPreset: state.setAllParamsFromPreset,
  }));
  const colorRGB = useUiColorRGB();

  const filteredPresets = presets?.filter((p) => {
    return (
      (type === "all" || p.type.toLowerCase() === type.toLowerCase()) &&
      p.name.toLowerCase().includes(input.toLowerCase())
    );
  });

  const deletePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/presets", {
      method: "DELETE",
      body: JSON.stringify({ email, id: selectedPreset }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      setCurrentPreset(presetLibrary.find((p) => p.default === true).settings);
      setAllParamsFromPreset(
        presetLibrary.find((p) => p.default === true).settings
      );
      setSelectedPreset(presetLibrary.find((p) => p.default === true).id);
      deletePresetFromLibrary(selectedPreset);
      setMessage("Preset deleted successfully");
      setInterval(() => setIsDeleting(false), 2000);
      setInterval(() => setMessage(""), 2000);
    } else {
      setMessage("Incorrect email");
    }
  };

  const handlePresetChange = (preset) => {
    useSynthSettingsStore.getState().setAllParamsFromPreset(preset.settings);
    usePresetLibraryStore.getState().setSelectedPreset(preset.id);
    usePresetLibraryStore.getState().setCurrentPreset(preset.settings);
    setIsDeleting(false);
    setIsSharing(false);
    setMessage("");
  };

  const handleShare = () => {
    if (isSharing) {
      setShareUrl("");
      setIsSharing(false);
      return;
    }
    const url = new URL("/", window.location.origin);
    url.searchParams.append("preset", selectedPreset);
    console.log(url);
    setShareUrl(url.href);
    setIsSharing(!isSharing);
    setIsDeleting(false);
    setMessage("");
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setMessage("Copied to clipboard");
  };

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
              onFocus={() => {setType("all")
                polySynth?.muteKeyboard()
              }}
              onBlur={() => setInput("")}
              value={input}
            
            />
            {input && (
              <div
                style={{
                  cursor: "pointer",
                  paddingTop: "2px",
                }}
                onClick={() => setInput("")}
              >
                Clear All
              </div>
            )}
          </div>
        </div>
        <div className={styles.types}>
          {types.map((t) => (
            <button
              key={t}
              className={type === t ? styles.selected_type : styles.type}
              onClick={() => setType(t)}
            >
              {t}
            </button>
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
                  className={selectedPreset === p.id ? styles.selected : ""}
                  onClick={() => handlePresetChange(p)}
                >
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.description}>
            <div>
              <h6>Description</h6>
              <div>
                {
                  filteredPresets.find((p) => p.id === selectedPreset)
                    ?.description
                }
              </div>
            </div>
            <div>
              <hr />
              <button onClick={handleShare}>
                <IconShare3 stroke={2} size={18} />
              </button>
              <button
                onClick={() => {
                  setIsDeleting(!isDeleting);
                  setIsSharing(false);
                  setMessage("");
                }}
              >
                <IconTrashX stroke={2} size={18} />
              </button>
            </div>
          </div>
        </div>
        {isDeleting && (
          <form className={styles.delete} onSubmit={deletePreset}>
            <div>Enter an email you used to save this preset</div>
            <input
              type="text"
              placeholder="your email"
              className={styles.search_input}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            {message !== "" && (
              <div
                className={styles.message}
                style={{
                  color:
                    message === "Preset deleted successfully"
                      ? "inherit"
                      : "#EF4949",
                }}
              >
                {message}
              </div>
            )}
            <div className={styles.buttons}>
              <button type="submit">delete</button>
              <button
                type="reset"
                onClick={() => {
                  setIsDeleting(false);
                  setMessage("");
                }}
              >
                cancel
              </button>
            </div>
          </form>
        )}
        {isSharing && (
          <div className={styles.share}>
            <div>Share this preset</div>
            <button className={styles.share_url} onClick={copyUrl}>
              {shareUrl}
            </button>
            {message !== "" && <div className={styles.message}>{message}</div>}

            <div className={styles.buttons}>
              <button onClick={copyUrl}>copy url</button>
              <button onClick={handleShare}>cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
