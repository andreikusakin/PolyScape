import { create } from "zustand";
import { Preset } from "../types/types";
import { presetsList } from "../presets/presetsList";

type PresetLibraryStore = {
  currentPreset: Preset | null;
  presetLibrary: {
    id: string;
    name: string;
    type: string;
    description: string;
    author: string;
    settings: Preset;
  } | null;
  selectedPreset: String;
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
  addPreset: (preset: Preset) => void;
};

export const usePresetLibraryStore = create<PresetLibraryStore>((set) => ({
  currentPreset: null,
  presetLibrary: null,
  selectedPreset: '',
  setCurrentPreset: (preset) => set({ currentPreset: preset }),
  setSelectedPreset: (selectedPreset) => set({ selectedPreset }),
  setPresetLibrary: (presets) => set({ presetLibrary: presets }),
  addPreset: (preset) =>
    set((state) => ({
      presetLibrary: [...state.presetLibrary, preset],
    })),
}));
