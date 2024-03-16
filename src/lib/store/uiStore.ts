import { create } from "zustand";

type UiStore = {
  isKeyboardOpen: boolean;
  isFxOpen: boolean;
  isUiVisible: boolean;
  isSavePresetOpen: boolean;
  isPresetLibraryOpen: boolean;
  togglePresetLibraryOpen: () => void;
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
  isPresetLibraryOpen: false,
  togglePresetLibraryOpen: () =>
    set((state) => ({
      isPresetLibraryOpen: !state.isPresetLibraryOpen,
    })),
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
