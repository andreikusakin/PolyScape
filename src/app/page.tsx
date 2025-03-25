import { useEffectsEngineStore } from "@/lib/store/settingsStore";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Visualization = dynamic(() => import("@/components/Visualization"), {
  ssr: false,
});

const PolySynth = dynamic(() => import("@/components/PolySynth/PolySynth"), {
  ssr: false,
});

export default async function Home() {

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Visualization /> */}
        <PolySynth />
      </Suspense>
    </main>
  );
}
