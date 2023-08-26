import { FC } from "react";
import styles from "./GameInfo.module.scss";
import { LocatedGameInfo } from "../../App";
import { Bubble } from "../Bubble/Bubble";

const round = (n: number, p: number) => {
  return Math.round(n * 10 ** p) / 10 ** p;
};

export interface GameInfoProps {
  game: LocatedGameInfo;
}

export const GameInfo: FC<GameInfoProps> = ({ game }) => {
  return (
    <div className={styles.gameInfo}>
      {game.bestWith?.length ? (
        <Bubble>
          Best with:&nbsp;
          <span className={styles.bold}>{game.bestWith?.join(" / ")}</span>
        </Bubble>
      ) : undefined}
      {game.rank ? (
        <Bubble>
          BGG Rank:&nbsp;
          <span className={styles.bold}>{round(game.rank, 1)}</span>
        </Bubble>
      ) : undefined}
      {game.weight ? (
        <Bubble>
          Complexity:&nbsp;
          <span className={styles.bold}>{round(game.weight, 1)}</span>
        </Bubble>
      ) : undefined}
    </div>
  );
};
