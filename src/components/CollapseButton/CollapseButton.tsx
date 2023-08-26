import { FC, useState } from "react";
import styles from "./CollapseButton.module.scss";

interface CollapseButtonProps {
  fn: () => void;
  expanded: boolean;
}

export const CollapseButton: FC<CollapseButtonProps> = ({ fn, expanded }) => {
  const [rotation, setRotation] = useState(0);

  return (
    <div
      className={styles.container}
      onClick={() => {
        setRotation((curr) => curr + 90);
        fn();
      }}
    >
      <svg
        className={styles.plus}
        style={{ opacity: expanded ? 0 : 1, rotate: `${rotation}deg` }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
      </svg>
      <svg
        className={styles.minus}
        style={{ opacity: expanded ? 1 : 0, rotate: `${rotation}deg` }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
      </svg>
    </div>
  );
};
