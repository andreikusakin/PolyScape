"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { Orbit } from "next/font/google";

function Box(props: any) {
  const mesh = useRef<any>();
  useFrame((state, delta) => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });
  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFAE00" />
    </mesh>
  );
}
export const Demo3d = () => {
  return (
    <Canvas shadows dpr={1} style={{ height: "100vh", width: "100vw" }}>
      <OrbitControls />
      <ambientLight intensity={1} />
      <directionalLight />
      <pointLight position={[10, 0, 10]} intensity={1000} />
      {/* <Box position={[0, 0, 0]} /> */}
      <Spheres />
    </Canvas>
  );
};

function Spheres() {
  const ref = useRef<any>();

  useFrame(({clock}) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.05;
  });

  return (
    <group ref={ref}>
      <Sphere args={[1, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="purple"
          emissive={"purple"}
          emissiveIntensity={0.5}
          roughness={0.5}
        />
      </Sphere>
      <Sphere args={[1, 16, 16]} position={[3, 0, 0]}>
        <meshStandardMaterial
          color="purple"
          emissive={"purple"}
          emissiveIntensity={0.5}
          roughness={0.5}
        />
      </Sphere>
    </group>
  );
}
