import { create } from "zustand";
import { useSynthSettingsStore } from "./settingsStore";
import { colorMap } from "../utils/colorMap";

type UiStore = {
  isKeyboardOpen: boolean;
  isFxOpen: boolean;
  isUiVisible: boolean;
  isSavePresetOpen: boolean;
  isCustomColor: boolean;
  customColor: number[];
  setIsCustomColor: (value: boolean) => void;
  setCustomColor: (color: number[]) => void;
  toggleSavePresetOpen: () => void;
  toggleKeyboardOpen: () => void;
  toggleFxOpen: () => void;
  toggleUiVisible: () => void;
};

export const useUiStore = create<UiStore>()((set) => ({
  isKeyboardOpen: true,
  isFxOpen: false,
  isUiVisible: true,
  isSavePresetOpen: false,
  isCustomColor: false,
  customColor: [255, 255, 255],
  setIsCustomColor: (value: boolean) => {
    set(() => ({ isCustomColor: value }));
  },
  setCustomColor: (color: number[]) => {
    set(() => ({ customColor: color }));
  },
  toggleSavePresetOpen: () =>
    set((state) => ({
      isSavePresetOpen: !state.isSavePresetOpen,
    })),

  toggleKeyboardOpen: () =>
    set((state) => ({
      isKeyboardOpen: !state.isKeyboardOpen,

      isFxOpen: state.isKeyboardOpen ? state.isFxOpen : false,
    })),
  toggleFxOpen: () =>
    set((state) => ({
      isFxOpen: !state.isFxOpen,

      isKeyboardOpen: state.isFxOpen ? state.isKeyboardOpen : false,
    })),

  toggleUiVisible: () =>
    set((state) => ({
      isUiVisible: !state.isUiVisible,
    })),
}));

export const useUiColorRGB = () => {
  const { isCustomColor, customColor } = useUiStore(state => ({
    isCustomColor: state.isCustomColor,
    customColor: state.customColor,
  }));

  const synthSettings = useSynthSettingsStore(state => ({
    osc1Type: state.osc1.type,
    osc2Type: state.osc2.type,
  }));

  if (isCustomColor) {
    return customColor;
  } else {
    const key = `${synthSettings.osc1Type}-${synthSettings.osc2Type}`;
    return colorMap[key] || [255, 255, 255]; // Default to white if not found
  }
};
