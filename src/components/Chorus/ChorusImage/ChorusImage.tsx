import styles from "./ChorusImage.module.css";
import { Bungee_Outline } from "next/font/google";

const bungee = Bungee_Outline({ weight: "400", subsets: ["latin"] });

export const ChorusImage = () => {
  return (
    <div className={`${bungee.className} ${styles.container}`}>
      <h4>Chorus</h4>
      </div>
  )
}
