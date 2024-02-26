import { type } from "os";
import styles from "./SectionWrapper.module.css";

type SectionWrapperProps = {
  name?: string;
  children: React.ReactNode;
};

export const SectionWrapper = ({ name, children }: SectionWrapperProps) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.container}>{children}</div>
    </section>
  );
};
