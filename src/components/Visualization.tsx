"use client";

import { useUiColorRGB } from "@/lib/store/uiStore";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Leva } from 'leva'
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
} from "@react-three/postprocessing";
import { CustomSphere } from "./CustomSphere";
import * as Tone from "tone/build/esm/index";
import { useEffect, useRef } from "react";
import {
  useEffectsEngineStore,
  useSynthEngineStore,
} from "@/lib/store/settingsStore";

const Scene = () => {
  const color = useUiColorRGB();
  const meterRef = useRef<Tone.Meter>();


  const { effectsEngine } = useEffectsEngineStore((state) => ({
    effectsEngine: state.effectsEngine,
  }));

  useEffect(() => {
    
    meterRef.current = new Tone.Meter(0.1);
    effectsEngine?.outputNode.connect(meterRef.current);
  }, []);

  console.log(meterRef.current?.getValue?.());

  return (
    <>
    <Leva hidden  />
      {/* <OrbitControls /> */}
      <PerspectiveCamera fov={100} position={[0, 0, 5]} makeDefault />
  
    
      <Environment background files="/envmaps/nightSky/night_sky_2k.hdr" environmentIntensity={10}
        backgroundIntensity={0.01} 
      />
      <directionalLight
        color={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
        intensity={10}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[0.25, 2, -2.25]}
        receiveShadow
      />
      
      <CustomSphere />
      
    </>
  );
};

const Visualization = () => {

  

  const { effectsEngine } = useEffectsEngineStore((state) => ({
    effectsEngine: state.effectsEngine,
  }));

  const { synthEngine } = useSynthEngineStore((state) => ({
    synthEngine: state.synthEngine,
  }));

  console.log(synthEngine)
  return (
    <div className="h-screen w-screen fixed top-0 left-0 z-0">
      {synthEngine !== undefined && <Canvas shadows>
        <color attach="background" args={["#000000"]} />
        <Scene />
        <EffectComposer>
          <Bloom
            intensity={0.2}
            blurPass={undefined}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur={true}
          />
        </EffectComposer>
      </Canvas>}
      
    </div>
  );
};

export default Visualization;