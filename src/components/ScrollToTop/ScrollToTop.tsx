import { FC, useCallback, useEffect, useState } from "react";
import styles from "./ScrollToTop.module.scss";

export const ScrollToTop: FC = () => {
  const [opacity, setOpacity] = useState(window.scrollY < 150 ? 0 : 1);

  const handleScroll = useCallback(() => {
    if (window.scrollY < 150) {
      setOpacity(0);
    } else {
      setOpacity(1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleClick = async () => {
    const increment = Math.floor(window.scrollY / 10);
    let pos = window.scrollY;
    const scrollInterval = setInterval(() => {
      window.scrollTo(0, pos);
      pos -= increment;
    }, 1);
    setTimeout(() => {
      clearTimeout(scrollInterval);
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <div className={styles.container} style={{ opacity }}>
      <div
        className={`${styles.scrollToTop} ${
          opacity === 1 ? styles.clickable : ""
        }`}
        onClick={opacity === 1 ? handleClick : undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.arrow}
          viewBox="0 0 384 512"
        >
          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
        </svg>
      </div>
    </div>
  );
};
