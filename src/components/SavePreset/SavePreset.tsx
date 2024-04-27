import { useUiColorRGB } from "@/lib/store/uiStore";
import styles from "./SavePreset.module.css";
import { useState } from "react";
import { useSynthSettingsStore } from "@/lib/store/settingsStore";
import { usePresetLibraryStore } from "@/lib/store/presetLibraryStore";

export const SavePreset = ({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) => {
  const colorRGB = useUiColorRGB();
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [presetName, setPresetName] = useState("");
  const [presetType, setPresetType] = useState("lead");
  const [message, setMessage] = useState("");
  const { aggregateSettings } = useSynthSettingsStore((state) => ({
    aggregateSettings: state.aggregateSettings,
  }));

  const {  setSelectedPreset, presetLibrary, setCurrentPreset } = usePresetLibraryStore((state) => ({
  
    setSelectedPreset: state.setSelectedPreset,
    presetLibrary: state.presetLibrary,
    setCurrentPreset: state.setCurrentPreset,
  }));

  async function savePreset(e: React.FormEvent) {
    console.log("called")
    e.preventDefault();
    const data = {
      author,
      email,
      description,
      name: presetName,
      type: presetType,
      settings: aggregateSettings(),
    };
    const response = await fetch("/api/presets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      const data = await response.json();
      
     
      presetLibrary.unshift(data.preset);
      console.log(data.preset)
      console.log(presetLibrary);
      setSelectedPreset(data.preset.id);
      setIsOpen(false);
    } else {
      setMessage("Error saving preset. Please try again.");
    }
  }

  return (
    <div
      className={styles.container}
      style={{ "--custom-color": colorRGB } as React.CSSProperties}
    >
      <h1>Save Preset</h1>
      <form onSubmit={savePreset}>
        <div className={styles.input_container}>
          <label htmlFor="presetName">Preset Name</label>
          <input
            type="text"
            id="presetName"
            name="presetName"
            placeholder="Enter Preset Name"
            required
            onChange={(e) => setPresetName(e.target.value)}
          />
        </div>

        <div className={styles.input_container}>
          <label htmlFor="presetType">Preset Type</label>
          <select
            id="presetType"
            name="presetType"
            required
            onChange={(e) => setPresetType(e.target.value)}
          >
            <option value="lead">Lead</option>
            <option value="bass">Bass</option>
            <option value="pad">Pad</option>
            <option value="fx">Fx</option>
            <option value="keys">Keys</option>
            <option value="drums">Drums</option>
            <option value="misc">Misc</option>
          </select>
        </div>

        <div className={styles.input_container}>
          <label htmlFor="author">Your Name</label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="Enter Your Name"
            required
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className={styles.input_container}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.buttons}>
          <button
            type="reset"
            className={styles.cancel_button}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className={styles.save_button}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
