import styles from "./Modal.module.css";

export const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
