import styles from "@/styles/Chapter.module.scss";

const Chapter = () => {
  return (
    <div className={styles.chapterContainer}>
      <div className={styles.chapterInfo}>
        <span className={styles.chapterNumber}>Chapter 258</span>
        <label className={styles.followCheckbox}>
          <input type="checkbox" />
          <span className={styles.checkmark}></span>
          <span className={styles.labelText}>Theo dõi</span>
        </label>
      </div>
    </div>
  );
};

export default Chapter;
