import { create } from "zustand";
import * as THREE from "three";

type VisualisationStore = {
  uniforms: {
    uTime: { value: number };
    uPositionFrequency: { value: number };
    uTimeFrequency: { value: number };
    uStrength: { value: number };
    uWarpPositionFrequency: { value: number };
    uWarpTimeFrequency: { value: number };
    uWarpStrength: { value: number };
    uColorA: { value: THREE.Color };
    uColorB: { value: THREE.Color };
    uColorIntensity: { value: number },
  };
  setUniform: (name: string, value: any) => void;
};

export const useVisualisationStore = create<VisualisationStore>((set) => ({
   uniforms: { 
    uTime: { value: 0 },
    uPositionFrequency: { value: 0.5 },
    uTimeFrequency: { value: 0.4 },
    uStrength: { value: 0.3 },
    uWarpPositionFrequency: { value: 0.5 },
    uWarpTimeFrequency: { value: 0.4 },
    uWarpStrength: { value: 0.3 },
    uColorA: { value: new THREE.Color("#00ffff") },
    uColorB: { value: new THREE.Color("#00ffff") },
    uColorIntensity: { value: 0.25 },
   },
  setUniform: (name: string, value: any) =>
      set((state: { uniforms: any }) => ({
        uniforms: {
          ...state.uniforms,
          [name]: { value },
        },
      })),
}));