import { useUiStore } from "@/lib/store/uiStore";
import { useShallow } from "zustand/react/shallow";
import styles from "./GlobalSettings.module.css";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToRgba, rgbaToRgb } from "@uiw/color-convert";
import { useState } from "react";
import { HsvaColor } from '@uiw/color-convert';

export const GlobalSettings = () => {
  const { isCustomColor, customColor, setCustomColor, setIsCustomColor } =
    useUiStore(
      useShallow((state) => ({
        isCustomColor: state.isCustomColor,
        setCustomColor: state.setCustomColor,
        setIsCustomColor: state.setIsCustomColor,
        customColor: state.customColor,
      }))
    );
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 });
  const updateCustomColor = (hsvaColor: HsvaColor) => {
    setHsva({ ...hsva, ...hsvaColor });
    const rgba = hsvaToRgba(hsva);
    const rgb = rgbaToRgb(rgba);
    console.log(rgb);
    setCustomColor([rgb.r, rgb.g, rgb.b]);
    setIsCustomColor(true);
  };
  return (
    <div className={styles.container}>
      <h4>Global Settings</h4>
      <div className={styles.color_picker}>
        <label>Custom UI Color</label>
        <div>
          <button
            className={styles.color_box}
            style={{ "--color-rgb": customColor } as React.CSSProperties}
            onClick={() => setIsCustomColor(true)}
          ></button>
          <button
            onClick={() => setIsCustomColor(false)}
            className={styles.reset_color}
          >
            reset
          </button>
        </div>
        <Wheel
          color={hsva}
          onChange={(color) => updateCustomColor(color.hsva)}
          width={150}
            height={150}
        />
      </div>
    </div>
  );
};
