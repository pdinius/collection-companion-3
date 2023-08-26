import { FC, useRef } from "react";
import styles from "./TextView.module.scss";
import { LocatedGameInfo } from "../../App";
import { GameInfo } from "../GameInfo/GameInfo";

const truncate = (str: string) => {
  const chars = str.match(/\\u....|./g) || [];
  const res = chars.slice(0, 30);
  return res.length < chars.length ? res.join("") + " &hellip;" : res.join("");
};

export interface TextViewProps {
  game: LocatedGameInfo;
}

export const TextView: FC<TextViewProps> = ({ game }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  const name =
    spanRef.current?.offsetWidth && spanRef.current.offsetWidth > 500
      ? truncate(game.name)
      : game.name;
      
  return (
    <div className={styles.gameRow}>
      <a
        href={`https://boardgamegeek.com/boardgame/${game.id}/`}
        target="_blank"
        className={styles.gameTitle}
      >
        <span
          ref={spanRef}
          dangerouslySetInnerHTML={{
            __html: name,
          }}
          title={game.displayName}
        ></span>
        {game.name !== game.displayName ? (
          <span
            className={styles.subtitle}
            dangerouslySetInnerHTML={{
              __html: `&ensp;-&ensp;${game.displayName}`,
            }}
          ></span>
        ) : undefined}
      </a>
      <GameInfo game={game} />
    </div>
  );
};
