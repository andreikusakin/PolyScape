import PolySynth from "@/components/PolySynth/PolySynth";
import { Visualization } from "@/components/Visualization";
import { Suspense } from "react";

// async function getPresets() {
//   const presets = await prisma.preset.findMany();
  
//   return presets;
// }

export default async function Home() {
  // const presets = await getPresets();
  return (
    <main>
      {/* <div>{presets.map((p) => p.presetName)}</div> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Visualization />
        <PolySynth />
        {/* {names.map((name) => {
          return <div key={name.id}>{name.name}</div>
        })} */}
      </Suspense>
    </main>
  );
}
