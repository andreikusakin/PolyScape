import { create } from "zustand";
import { PresetLibraryStore } from "../types/types";

export const usePresetLibraryStore = create<PresetLibraryStore>((set) => ({
  currentPreset: null,
  presetLibrary: [],
  selectedPreset: "",
  setCurrentPreset: (preset) => set({ currentPreset: preset }),
  setSelectedPreset: (selectedPreset) => set({ selectedPreset }),
  setPresetLibrary: (presets) => set({ presetLibrary: presets }),
  addPreset: (preset) =>
    set((state) => ({
      presetLibrary: [...state.presetLibrary, preset],
    })),
  deletePresetFromLibrary: (id) =>
    set((state) => ({
      presetLibrary: state.presetLibrary.filter((p) => p.id !== id),
    })),
}));
