import PolySynth from "@/components/PolySynth/PolySynth";
import { initPreset } from "@/lib/presets/Init";
import { useSynthSettingsStore } from "@/lib/store/settingsStore";
import { stat } from "fs";
import { Suspense } from "react";

export default function Home() {

    

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
          <PolySynth preset={initPreset} />
      </Suspense>
    </main>
  );
}
