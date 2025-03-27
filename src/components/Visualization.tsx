"use client";

import { useUiColorRGB, useUiStore } from "@/lib/store/uiStore";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Leva } from "leva";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { CustomSphere } from "./CustomSphere";
import * as Tone from "tone/build/esm/index";
import { useEffect, useRef } from "react";
import {
  useEffectsEngineStore,
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";
import React from "react";
import { CustomPlane } from "./CustomPlane";
import { useShallow } from "zustand/react/shallow";
import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper } from "three";

export const Scene = () => {
  const {
    orbitControlsEnabled,
  } = useUiStore(
    useShallow((state) => ({
      orbitControlsEnabled: state.orbitControlsEnabled,
    }))
  );
  const color = useUiColorRGB();
  const meterRef = useRef<Tone.Meter>();
  const light1Ref = useRef<THREE.DirectionalLight>(null);
  const light2Ref = useRef<THREE.DirectionalLight>(null);

  const { effectsEngine } = useEffectsEngineStore((state) => ({
    effectsEngine: state.effectsEngine,
  }));

  const { osc1, osc2 } = useSynthSettingsStore(
    useShallow((state) => ({
      osc1: state.osc1.type,
      osc2: state.osc2.type,
    }))
  );
  const osc1Color =
    osc1 === "sine"
      ? "rgb(255, 0, 0)"
      : osc1 === "pulse"
      ? "rgb(0, 102, 255)"
      : osc1 === "sawtooth"
      ? "rgb(0, 255, 0)"
      : osc1 === "triangle"
      ? "rgb(255, 0, 255)"
      : "rgb(255, 0, 0)";

  const osc2Color =
    osc2 === "sine"
      ? "rgb(255, 0, 0)"
      : osc2 === "pulse"
      ? "rgb(0, 102, 255)"
      : osc2 === "sawtooth"
      ? "rgb(0, 255, 0)"
      : osc2 === "triangle"
      ? "rgb(255, 0, 255)"
      : "rgb(255, 0, 0)";

  useEffect(() => {
    meterRef.current = new Tone.Meter(0.1);
    effectsEngine?.outputNode.connect(meterRef.current);
  }, []);

  useFrame(({ clock }) => {
    if (light1Ref.current && light2Ref.current) {

      const time1 = clock.getElapsedTime() * 0.5;
      const radius1 = 3;
      light1Ref.current.position.x = Math.sin(time1) * radius1 + 5;
      light1Ref.current.position.y = Math.cos(time1) * radius1 + 4;
      // light1Ref.current.position.z = Math.sin(time1) * radius1;

      const time2 = clock.getElapsedTime() * 0.3;
      const radius2 = 6;
      light2Ref.current.position.x = Math.cos(time1) * radius1 - 1;
      light2Ref.current.position.y = Math.sin(time1) * radius1 + 4;
      light2Ref.current.position.z = Math.sin(time2) * radius2 + 5;

      light1Ref.current.lookAt(0, 0, 0);
      light2Ref.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <OrbitControls enabled={orbitControlsEnabled}/>
      <PerspectiveCamera fov={80} position={[0, 0, 3]} makeDefault />

      <Environment
        background
        files="/envmaps/nightSky/night_sky_2k.hdr"
        environmentIntensity={10}
        backgroundIntensity={0.01}
      />
      {/* <directionalLight
        color={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
        intensity={10}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[0.25, 2, 5]}
        receiveShadow
      /> */}
      <directionalLight
        ref={light1Ref}
        color={osc2Color}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[-2, 2, 5]}
        receiveShadow
      />
      <directionalLight
        ref={light2Ref}
        color={osc1Color}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[2, 3, 5]}
        receiveShadow
      />
      <CustomPlane />
      {/* <CustomSphere /> */}
    </>
  );
};

const Visualization = () => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 z-0">
      <Canvas shadows>
        <color attach="background" args={["#000000"]} />
        <Scene />
        {/* <EffectComposer>
          <Bloom
            intensity={0.2}
            blurPass={undefined}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur={true}
          />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
};

export default Visualization;
