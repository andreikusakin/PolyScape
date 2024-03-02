"use client";

import { useWaveformColor } from "@/lib/store/settingsStore";
import { Effects, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { Bloom } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";

//halo effect

const Dust = ({ count, color }) => {
  const mesh = useRef();
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 8;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      // particle.mx += (state.mouse.x * 1000 - particle.mx) * 0.01
      // particle.my += (state.mouse.y * 1000 - 1 - particle.my) * 0.01
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[0.05, 1]} />
        <meshStandardMaterial color={`rgb(${color})`} />
      </instancedMesh>
    </>
  );
};

const Scene = () => {
  const color = useWaveformColor();
  return (
    <>
      <OrbitControls />
      <ambientLight intensity={1} />
      <pointLight position={[0, 2, 1]} intensity={10} />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={`rgb(${color})`} />
      </mesh>

      <Dust count={1000} color={color} />
    </>
  );
};

export const Visualization = () => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 z-0">
      <Canvas>
        <color attach="background" args={["#000000"]} />
        <Scene />
        <EffectComposer>
          <DepthOfField focusDistance={0} focalLength={0.1} bokehScale={4} />

          <Bloom
            intensity={20} // The bloom intensity.
            blurPass={undefined} // A blur pass.
            kernelSize={KernelSize.LARGE} // blur kernel size
            luminanceThreshold={0.01} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.5} // smoothness of the luminance threshold. Range is [0, 1]
            mipmapBlur={true} // Enables or disables mipmap blur.
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
        </EffectComposer>
        
      </Canvas>
    </div>
  );
};
