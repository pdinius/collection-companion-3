import { FC } from "react";
import styles from "./Toggle.module.scss";

export interface ToggleProps {
  testForLeft: () => boolean;
  leftItem: string | JSX.Element;
  rightItem: string | JSX.Element;
  trigger: () => void;
  disabled?: boolean;
}

export const Toggle: FC<ToggleProps> = ({ testForLeft, leftItem, rightItem, trigger, disabled = false }) => {
  return (
    <div className={disabled ? styles.disabled : ''}>
      <div
        className={`${styles.viewOption} ${
          testForLeft() && !disabled ? styles.selected : ""
        }`}
      >
        { leftItem }
      </div>
      <div className={styles.toggle} onClick={disabled ? () => {} : trigger}>
        <div
          className={`${styles.toggleSlider} ${
            testForLeft() ? "" : styles.sliderRight
          }`}
        ></div>
      </div>
      <div
        className={`${styles.viewOption} ${
          testForLeft() || disabled ? "" : styles.selected
        }`}
      >
        { rightItem }
      </div>
    </div>
  );
};
