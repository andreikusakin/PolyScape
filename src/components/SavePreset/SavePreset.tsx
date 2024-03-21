import { useUiColorRGB } from "@/lib/store/uiStore";
import styles from "./SavePreset.module.css";
import { useUiStore } from "@/lib/store/uiStore";
import { useShallow } from "zustand/react/shallow";

export const SavePreset = ({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) => {
  const colorRGB = useUiColorRGB();
  return (
    <div
      className={styles.container}
      style={{ "--custom-color": colorRGB } as React.CSSProperties}
    >
      <h1>Save Preset</h1>
      <form>
        <div className={styles.input_container}>
          <label htmlFor="presetName">Preset Name</label>
          <input
            type="text"
            id="presetName"
            name="presetName"
            placeholder="Enter Preset Name"
            required
          />
        </div>

        <div className={styles.input_container}>
          <label htmlFor="presetType">Preset Type</label>
          <select id="presetType" name="presetType" required>
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
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            required
            placeholder="Enter Description"
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
