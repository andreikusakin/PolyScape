"use client";

import dynamic from "next/dynamic";
import React from "react";

const PolySynth = dynamic(() => import("@/components/PolySynth"), {
  ssr: false,
});

export default function page() {
  return (
    <div>
      <PolySynth />
    </div>
  );
}
