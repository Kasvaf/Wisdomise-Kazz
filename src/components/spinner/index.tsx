import styles from "./spinner.module.css";

const Spinner: React.FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.face}>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.face}>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
};
export default Spinner;
