import PolySynth from "@/components/PolySynth/PolySynth";
import { Visualization } from "@/components/Visualization";
import { initPreset } from "@/lib/presets/Init";
import { useSynthSettingsStore } from "@/lib/store/settingsStore";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Visualization />
        <PolySynth preset={initPreset} />
      </Suspense>
    </main>
  );
}
