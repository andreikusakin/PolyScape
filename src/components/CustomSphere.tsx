import React, { useEffect, useRef } from "react";
import * as Tone from "tone/build/esm/index";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
// @ts-ignore
import customSphereFragment from "./shaders/customSphereFragment.glsl";
// @ts-ignore
import customSphereVertex from "./shaders/customSphereVertex.glsl";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useVisualisationStore } from "@/lib/store/visualisationStore";
import { useUiColorRGB, useUiStore } from "@/lib/store/uiStore";
import { useShallow } from "zustand/react/shallow";
import { useSynthEngineStore, useSynthSettingsStore } from "@/lib/store/settingsStore";


export const CustomSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<CustomShaderMaterial>();
  const depthMaterialRef = useRef<CustomShaderMaterial>();
  const geometryRef = useRef<THREE.BufferGeometry>();
  const { isCustomColor, customColor } = useUiStore(
    useShallow((state) => ({
      isCustomColor: state.isCustomColor,
      customColor: state.customColor,
    }))
  );
  const colorRGB = useUiColorRGB();

  const { synthEngine } = useSynthEngineStore((state) => ({
    synthEngine: state.synthEngine,
  }));

  const { envelopeAmplitude, filter, filterEnvelope } = useSynthSettingsStore((state) => ({
    envelopeAmplitude: state.envelopeAmplitude,
    filter: state.filter,
    filterEnvelope: state.filterEnvelope,
  }));

  const { uniforms, setUniform } = useVisualisationStore(
    useShallow((state) => ({
      uniforms: state.uniforms,
      setUniform: state.setUniform,
    }))
  );

  const materialProps = useControls("Sphere", {
    metalness: { value: 0, min: 0, max: 1, step: 0.001 },
    roughness: { value: 0, min: 0, max: 1, step: 0.001 },
    transmission: { value: 1, min: 0, max: 1, step: 0.001 },
    ior: { value: 3.4, min: 1, max: 10, step: 0.001 },
    thickness: { value: 2.4, min: 0, max: 10, step: 0.001 },
    color: '#ffffff',
    uColorA: {
      value: "#ffffff",
      onChange: (value) => setUniform("uColorA", new THREE.Color(value)),
    },
    uColorB: {
      value: "#ffffff",
      onChange: (value) => setUniform("uColorB", new THREE.Color(value)),
    },
    uPositionFrequency: {
      value: uniforms.uPositionFrequency.value,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (value) => setUniform("uPositionFrequency", value),
    },
    uTimeFrequency: {
      value: uniforms.uTimeFrequency.value,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (value) => setUniform("uTimeFrequency", value),
    },
    uStrength: {
      value: uniforms.uStrength.value,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (value) => setUniform("uStrength", value),
    },
    uWarpPositionFrequency: {
      value: uniforms.uWarpPositionFrequency.value,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (value) => setUniform("uWarpPositionFrequency", value),
    },
    uWarpTimeFrequency: {
      value: uniforms.uWarpTimeFrequency.value,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (value) => setUniform("uWarpTimeFrequency", value),
    },
    uWarpStrength: {
      value: uniforms.uWarpStrength.value,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (value) => setUniform("uWarpStrength", value),
    },
  });

  useEffect(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: customSphereVertex,
      fragmentShader: customSphereFragment,
      metalness: materialProps.metalness,
      roughness: materialProps.roughness,
      color: materialProps.color,
      transmission: materialProps.transmission,
      ior: materialProps.ior,
      thickness: materialProps.thickness,
      transparent: true,
      wireframe: false,
      silent: true,
      uniforms: uniforms,
      iridescence: 1,
      iridescenceIOR: 1,
    });

    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: customSphereVertex,
      depthPacking: THREE.RGBADepthPacking,
      uniforms: uniforms,
    });

    const geometry = new THREE.IcosahedronGeometry(2.5, 50);
    const mergedGeometry = mergeVertices(geometry);
    mergedGeometry.computeTangents();

    materialRef.current = material;
    depthMaterialRef.current = depthMaterial;
    geometryRef.current = mergedGeometry;
  }, [materialProps, uniforms]);

  console.log(filterEnvelope);

  useFrame((state, delta) => {
    if (synthEngine) {
      let totalEnvelopeValue = 0.5;

      synthEngine.voices.forEach((voice) => {
        totalEnvelopeValue += voice.envelope.value / 4;
      });

      uniforms.uStrength.value = (totalEnvelopeValue * filterEnvelope.baseFrequency / 10000 + 0.2) * 0.5;
      uniforms.uTime.value += delta / 2 + totalEnvelopeValue / 100;
      uniforms.uPositionFrequency.value = totalEnvelopeValue;
      console.log(totalEnvelopeValue);
    }
  });

  console.log("customColor", customColor);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 50, 50]} />
        <meshStandardMaterial
          color={
            isCustomColor
              ? `rgb(${customColor[0]}, ${customColor[1]}, ${customColor[2]})`
              : `rgb(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]})`
          }
        />
      </mesh>
      <mesh
        ref={meshRef}
        geometry={geometryRef.current}
        material={materialRef.current}
        receiveShadow
        castShadow
        customDepthMaterial={depthMaterialRef.current}
      />
    </group>
  );
};
