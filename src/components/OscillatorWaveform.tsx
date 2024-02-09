import { Sawtooth, Sine, Square, Triangle } from "./Shapes";

export const OscillatorWaveform = ({
  oscType,
}: {
  oscType: "sine" | "sawtooth" | "pulse" | "triangle" | "square";
}) => {
  switch (oscType) {
    case "sine":
      return <Sine />;
    case "sawtooth":
      return <Sawtooth />;
    case "pulse":
      return <Square />;
    case "square":
      return <Square />;
    case "triangle":
      return <Triangle />;
    default:
      return null;
  }
};
