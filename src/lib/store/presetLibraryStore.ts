import { create } from "zustand";
import { Preset } from "../types/types";
import { presetsList } from "../presets/presetsList";

type PresetLibraryStore = {
  presetLibrary: Preset[];
  addPreset: (preset: Preset) => void;
};

export const usePresetLibraryStore = create<PresetLibraryStore>((set) => ({
  presetLibrary: presetsList,
  addPreset: (preset) =>
    set((state) => ({
      presetLibrary: [...state.presetLibrary, preset],
    })),
}));
