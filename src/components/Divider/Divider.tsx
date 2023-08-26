import { FC } from 'react';
import styles from './Divider.module.scss';

export interface DividerProps {

}

export const Divider: FC<DividerProps> = () => {
  return (<div className={styles.container}>
    <div className={styles.divider}></div>
  </div>);
};
