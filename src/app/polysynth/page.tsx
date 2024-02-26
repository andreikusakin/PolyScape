"use client";

import { initPreset } from "@/lib/presets/Init";
import dynamic from "next/dynamic";
import React from "react";

const PolySynth = dynamic(() => import("@/components/PolySynth/PolySynth"), {
  ssr: false,
});

export default function page() {
  return (
    <div>
      <PolySynth preset={initPreset}/>
    </div>
  );
}
