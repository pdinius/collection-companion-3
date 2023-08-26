import { FC } from "react";
import styles from "./ImageView.module.scss";
import { LocatedGameInfo } from "../../App";

export interface ImageViewProps {
  game: LocatedGameInfo;
  numPlayers?: number;
  alt?: boolean;
}

export const ImageView: FC<ImageViewProps> = ({ game, numPlayers, alt = false }) => {
  const bestWith = (game: LocatedGameInfo): boolean => {
    if (numPlayers === undefined || game.bestWith === undefined) return false;
    return game.bestWith.includes(numPlayers);
  };

  return (
    <div className={styles.container}>
      <a
        href={`https://boardgamegeek.com/boardgame/${game.id}/`}
        target="_blank"
      >
        <img
          src={`/src/assets/box-covers/${
            (game.image_url.match(/\w+\.\w+$/) || [""])[0]
          }`}
          className={`${styles.gameImage} ${
            bestWith(game) ? styles.bestWith : ""
          }`}
          title={game.displayName}
          alt={game.displayName}
          onError={function (e) {
            const target = e.target as HTMLImageElement;
            target.src = game.image_url;
            console.log(`error with ${game.name} picture`);
          }}
        />
      </a>
      {bestWith(game) ? (
        <div className={styles.bestWithBubble}>Best With {numPlayers}</div>
      ) : undefined}
    </div>
  );
};
