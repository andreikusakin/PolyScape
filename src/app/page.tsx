"use client";
import { Welcome } from "@/components/Welcome/Welcome";
import { useAudioContextStore } from "@/lib/store/audioContextStore";
import { useEffectsEngineStore } from "@/lib/store/settingsStore";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const Visualization = dynamic(() => import("@/components/Visualization"), {
  ssr: false,
});

const PolySynth = dynamic(() => import("@/components/PolySynth/PolySynth"), {
  ssr: false,
});



export default function Home() {
  const { contextStarted } = useAudioContextStore(
    (state) => ({
      contextStarted: state.contextStarted,
  
    })
  );

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
        {/* <Visualization /> */}
        {contextStarted && <PolySynth />}
        
      </Suspense>
    </main>
  );
}
