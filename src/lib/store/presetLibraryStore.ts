import { create } from "zustand";
import { Preset } from "../types/types";
import { presetsList } from "../presets/presetsList";

type PresetLibraryStore = {
  presetLibrary: Preset[];
  setPresetLibrary: (presets: Preset[]) => void;
  addPreset: (preset: Preset) => void;
};

export const usePresetLibraryStore = create<PresetLibraryStore>((set) => ({
  presetLibrary: presetsList,
  setPresetLibrary: (presetLibrary) => set({ presetLibrary }),
  addPreset: (preset) =>
    set((state) => ({
      presetLibrary: [...state.presetLibrary, preset],
    })),
}));
