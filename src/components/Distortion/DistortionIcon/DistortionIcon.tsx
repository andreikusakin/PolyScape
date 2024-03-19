import { Coda } from "next/font/google";
import styles from "./DistortionIcon.module.css";

const coda = Coda({ weight: "400", subsets: ["latin"] });

export const DistortionIcon = () => {
  return (
    <div className={`${coda.className} ${styles.container}`}>
      <h3>distortion</h3>
    </div>
  );
};
