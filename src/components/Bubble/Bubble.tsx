import { FC } from 'react';
import styles from './Bubble.module.scss';

export interface BubbleProps {
  children: React.ReactNode;
}

export const Bubble: FC<BubbleProps> = ({ children }) => {
  return (<div className={styles.bubble}>
    {children}
  </div>);
};
