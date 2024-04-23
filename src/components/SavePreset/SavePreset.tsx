import { useUiColorRGB } from "@/lib/store/uiStore";
import styles from "./SavePreset.module.css";
import { useUiStore } from "@/lib/store/uiStore";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { useSynthSettingsStore } from "@/lib/store/settingsStore";

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
  const { aggregateSettings } = useSynthSettingsStore((state) => ({
    aggregateSettings: state.aggregateSettings,
  }));

  async function savePreset(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      author,
      email,
      description,
      name: presetName,
      type: presetType,
      settings: aggregateSettings(),
    };
    console.log(data);
    const response = await fetch("/api/presets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const newPreset = await response.json();
      console.log(newPreset);
      setIsOpen(false);
    } else {
      console.error("Error saving preset");
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
