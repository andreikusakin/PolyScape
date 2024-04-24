import { create } from "zustand";
import { Preset } from "../types/types";
import { presetsList } from "../presets/presetsList";

type LibraryPreset = {
  id: string;
  name: string;
  type: string;
  description: string;
  author: string;
  settings: Preset;
};

type PresetLibraryStore = {
  currentPreset: Preset | null;
  presetLibrary: LibraryPreset[];
  selectedPreset: string;
  setCurrentPreset: (preset: Preset) => void;
  setSelectedPreset: (id: String) => void;
  setPresetLibrary: (presets: {
    id: string;
    name: string;
    type: string;
    description: string;
    author: string;
    settings: Preset;
  }) => void;
  addPreset: (preset: LibraryPreset) => void;
  deletePresetFromLibrary: (id: string) => void;
};

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
