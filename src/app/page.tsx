"use client";
import { Welcome } from "@/components/Welcome/Welcome";
import { useAudioContextStore } from "@/lib/store/audioContextStore";
import { motion } from "framer-motion";
import { Leva } from "leva";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const Visualization = dynamic(() => import("@/components/Visualization"), {
  ssr: false,
});

const PolySynth = dynamic(() => import("@/components/PolySynth/PolySynth"), {
  ssr: false,
});

export default function Home() {
  const { contextStarted } = useAudioContextStore((state) => ({
    contextStarted: state.contextStarted,
  }));

  return (
    <main>
      <Leva hidden />
      <Welcome />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Visualization />
      </motion.div>
      {contextStarted && <PolySynth />}
    </main>
  );
}
