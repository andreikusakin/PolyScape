import { type } from "os";
import styles from "./SectionWrapper.module.css";

type SectionWrapperProps = {
  name: string;
  children: React.ReactNode;
  wide?: boolean;
};

export const SectionWrapper = ({
  name,
  children,
  wide,
}: SectionWrapperProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div
        className={[wide ? styles.container_wide : styles.container].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};
