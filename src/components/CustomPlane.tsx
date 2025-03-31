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
import {
  useSynthEngineStore,
  useSynthSettingsStore,
} from "@/lib/store/settingsStore";

export const CustomPlane = () => {
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
  const uiColor = isCustomColor ? customColor : colorRGB;

  const { synthEngine } = useSynthEngineStore((state) => ({
    synthEngine: state.synthEngine,
  }));

  const { envelopeAmplitude, filter, filterEnvelope } = useSynthSettingsStore(
    (state) => ({
      envelopeAmplitude: state.envelopeAmplitude,
      filter: state.filter,
      filterEnvelope: state.filterEnvelope,
    })
  );

  const { uniforms, setUniform } = useVisualisationStore(
    useShallow((state) => ({
      uniforms: state.uniforms,
      setUniform: state.setUniform,
    }))
  );

  const materialProps = useControls("Plane", {
    metalness: { value: 1, min: 0, max: 1, step: 0.001 },
    roughness: { value: 0, min: 0, max: 1, step: 0.001 },
    transmission: { value: 1, min: 0, max: 1, step: 0.001 },
    ior: { value: 3.4, min: 1, max: 10, step: 0.001 },
    thickness: { value: 2.4, min: 0, max: 10, step: 0.001 },
    color: { r: 100, g: 255, b: 255, a: 1 },
    uColorA: {
      value: { r: uiColor[0], g: uiColor[1], b: uiColor[2] },
      onChange: (value) => setUniform("uColorA", new THREE.Color(value)),
    },
    uColorB: {
      value: { r: uiColor[0], g: uiColor[1], b: uiColor[2] },
      onChange: (value) => setUniform("uColorB", new THREE.Color(value)),
    },
    uColorIntensity: {
      value: 0.01,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (value) => setUniform("uColorIntensity", value),
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
      baseMaterial: THREE.MeshStandardMaterial,
      vertexShader: customSphereVertex,
      fragmentShader: customSphereFragment,
        metalness: materialProps.metalness,
        roughness: materialProps.roughness,
      //   color: materialProps.color,
      //   transmission: materialProps.transmission,
      //   ior: materialProps.ior,
      //   thickness: materialProps.thickness,
      //   transparent: true,
      //   wireframe: false,
      //   silent: true,
      uniforms: uniforms,
      //   iridescence: 1,
      //   iridescenceIOR: 1,
    });

    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      vertexShader: customSphereVertex,
      //   depthPacking: THREE.RGBADepthPacking,
      uniforms: uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 1.5, 300, 300);
    geometry.scale(10, 10, 10);
    geometry.rotateX(-Math.PI / 6);
    const mergedGeometry = mergeVertices(geometry);
    mergedGeometry.computeTangents();

    materialRef.current = material;
    depthMaterialRef.current = depthMaterial;
    geometryRef.current = mergedGeometry;
  }, [materialProps, uniforms]);

  useEffect(() => {
    if (uniforms) {
      // Choose the UI color: customColor takes priority if enabled, otherwise use colorRGB.
      const uiColor = isCustomColor ? customColor : colorRGB;
      // Convert 0–255 values to normalized 0–1
      const castColor = new THREE.Color(
        uiColor[0] / 255,
        uiColor[1] / 255,
        uiColor[2] / 255
      );
      uniforms.uColorA.value = castColor;
      uniforms.uColorB.value = castColor;
    }
  }, [uniforms, isCustomColor, customColor, colorRGB]);

  useFrame((state, delta) => {
    let totalEnvelopeValue = 0.5;
    if (synthEngine) {
      synthEngine.voices.forEach((voice) => {
        totalEnvelopeValue += voice.envelope.value / 4;
      });
    }
    console.log(totalEnvelopeValue)
    uniforms.uStrength.value =
      ((totalEnvelopeValue * filterEnvelope.baseFrequency) / 10000 + 0.2) * 0.5;
    uniforms.uTime.value += delta / 2 + totalEnvelopeValue / 100;
    // uniforms.uPositionFrequency.value = totalEnvelopeValue;
    uniforms.uTimeFrequency.value = 0.2 + totalEnvelopeValue / 1000;
    uniforms.uWarpPositionFrequency.value = ((totalEnvelopeValue * filterEnvelope.baseFrequency) / 10000 + 0.2) * 0.5;
    uniforms.uColorIntensity.value = totalEnvelopeValue * 0.5;
  });
  return (
    <group>
      {/* <mesh>
        <sphereGeometry args={[0.5, 50, 50]} />
        <meshStandardMaterial
          color={
            isCustomColor
              ? `rgb(${customColor[0]}, ${customColor[1]}, ${customColor[2]})`
              : `rgb(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]})`
          }
        />
      </mesh> */}
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
