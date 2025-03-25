import { useUiStore } from "@/lib/store/uiStore";
import { useShallow } from "zustand/react/shallow";
import styles from "./GlobalSettings.module.css";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToRgba, rgbaToRgb } from "@uiw/color-convert";
import { useState } from "react";
import { HsvaColor } from "@uiw/color-convert";

export const GlobalSettings = () => {
  const {
    isCustomColor,
    customColor,
    setCustomColor,
    setIsCustomColor,
    keyboardSize,
    setKeyboardSize,
    uiSize,
    setUiSize,
  } = useUiStore(
    useShallow((state) => ({
      isCustomColor: state.isCustomColor,
      setCustomColor: state.setCustomColor,
      setIsCustomColor: state.setIsCustomColor,
      customColor: state.customColor,
      keyboardSize: state.keyboardSize,
      setKeyboardSize: state.setKeyboardSize,
      uiSize: state.uiSize,
      setUiSize: state.setUiSize,
    }))
  );
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 });
  const [toggleColorWheel, setToggleColorWheel] = useState(false);
  const updateCustomColor = (hsvaColor: HsvaColor) => {
    setHsva({ ...hsva, ...hsvaColor });
    const rgba = hsvaToRgba(hsva);
    const rgb = rgbaToRgb(rgba);
    setCustomColor([rgb.r, rgb.g, rgb.b]);
    setIsCustomColor(true);
  };
  return (
    <div className={styles.container}>
      <h5>Preferences</h5>
      <div className={styles.section}>
        <span>Appearance</span>
        <div>
          <label>UI Color</label>
          <div className={styles.flexGap}>
            <button
              className={styles.color_box}
              style={{ "--color-rgb": customColor } as React.CSSProperties}
              onClick={() => {
                setIsCustomColor(true);
                setToggleColorWheel(!toggleColorWheel);
              }}
            ></button>
            <button onClick={() => {setIsCustomColor(false)
            setToggleColorWheel(false);
           setCustomColor([255,255,255])   
            }}>reset</button>
          </div>
         
        </div>
        {toggleColorWheel && 
          <Wheel
            color={hsva}
            onChange={(color) => updateCustomColor(color.hsva)}
            width={150 * uiSize}
            height={150 * uiSize}
          
          />}
        <div className={styles.keyboard_size}>
          <label>Keyboard Size</label>
          <div className={styles.flexGap}>
            <div>
              <button
                onClick={() => setKeyboardSize(keyboardSize - 0.1)}
                disabled={keyboardSize <= 0.5}
                style={{
                  marginRight: "0.2em",
                }}
              >
                -
              </button>
              <button
                onClick={() => setKeyboardSize(keyboardSize + 0.1)}
                disabled={keyboardSize >= 1.5}
              >
                +
              </button>
            </div>

          </div>
        </div>
        <div className={styles.ui_size}>
          <label>UI Size</label>
          <div className={styles.flexGap}>
            <select
              value={Math.floor(uiSize * 100)}
              onChange={(e) => setUiSize(parseInt(e.target.value) / 100)}
            >
              {[50, 75, 100, 125, 150, 175, 200].map((size) => (
                <option key={size} value={size}>
                  {size}%
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
