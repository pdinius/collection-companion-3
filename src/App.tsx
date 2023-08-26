import styles from "./App.module.scss";
import { useState, useRef, ReactNode } from "react";
import { useCollapse } from "react-collapsed";
import {
  FilterControls,
  Filters,
} from "./components/FilterControls/FilterControls";
import gameData from "./assets/truncated-data";
import { CollapseButton } from "./components/CollapseButton/CollapseButton";
import { allIds, locator } from "./assets/game-locations";
import { ImageView } from "./components/ImageView/ImageView";
import { TextView } from "./components/TextView/TextView";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";

export type LocatedGameInfo = {
  id: number;
  name: string;
  displayName: string;
  avg_user_rating?: number;
  geek_rating?: number;
  rank?: number;
  rating?: number;
  location: string;
  bestWith?: Array<number>;
  weight?: number;
  min_playtime?: number;
  max_playtime?: number;
  min_players?: number;
  max_players?: number;
  image_url: string;
  year_published?: number;
};

const camelToLabel = (str: string) =>
  str.replace(/(?=[A-Z])/g, " ").replace(/\w/, (m) => m.toUpperCase());

const games: { [key: number]: LocatedGameInfo } = gameData;
const grouped = Object.keys(locator) as Array<keyof typeof locator>;

function App() {
  const [filters, setFilters] = useState<Filters>({
    viewStyle: "text",
    sortBy: "shelf",
    sortDir: "asc",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const collapseArr = Array.from({ length: grouped.length }, () =>
    useCollapse({ defaultExpanded: true })
  );

  const filterGames = (v: LocatedGameInfo) => {
    let res = true;
    if (filters.numPlayers !== undefined && v.min_players && v.max_players) {
      if (
        v.min_players > filters.numPlayers ||
        v.max_players < filters.numPlayers
      )
        res = false;
    }
    if (v.weight !== undefined) {
      if (
        filters.min_complexity !== undefined &&
        v.weight < filters.min_complexity
      ) {
        res = false;
      }
      if (
        filters.max_complexity !== undefined &&
        v.weight > filters.max_complexity
      ) {
        res = false;
      }
    }
    if (
      filters.searchQuery &&
      !v.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !v.displayName.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      res = false;
    }
    if (
      filters.onlyBestWith &&
      filters.numPlayers &&
      !v.bestWith?.includes(filters.numPlayers)
    ) {
      res = false;
    }
    return res;
  };

  const sortGames = (a: LocatedGameInfo, b: LocatedGameInfo) => {
    switch (filters.sortBy) {
      case "alpha":
        return filters.sortDir === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      case "avg_rating":
        return filters.sortDir === "desc"
          ? (b.avg_user_rating || 0) - (a.avg_user_rating || 0)
          : (a.avg_user_rating || 0) - (b.avg_user_rating || 0);
      case "bgg_rank":
        return filters.sortDir === "desc"
          ? (b.geek_rating || 0) - (a.geek_rating || 0)
          : (a.geek_rating || 0) - (b.geek_rating || 0);
      case "complexity":
        return filters.sortDir === "desc"
          ? (b.weight || -Infinity) - (a.weight || -Infinity)
          : (a.weight || Infinity) - (b.weight || Infinity);
      case "phils_rating":
        return filters.sortDir === "desc"
          ? (b.rating || 0) - (a.rating || 0)
          : (a.rating || 0) - (b.rating || 0);
      case "play_time":
        return filters.sortDir === "desc"
          ? (b?.min_playtime || 0) - (a?.min_playtime || 0) ||
              (b?.max_playtime || 0) - (a?.max_playtime || 0)
          : (a?.min_playtime || 0) - (b?.min_playtime || 0) ||
              (a?.max_playtime || 0) - (b?.max_playtime || 0);
      default:
        return 0;
    }
  };

  return (
    <>
      <FilterControls filters={filters} setFilters={setFilters} />
      <div ref={containerRef} title="container">
        {grouped
          ? grouped
              .sort((a, b) => {
                const baseIdx = [
                  "hot",
                  "upstairs",
                  "downstairs",
                  "cabinets",
                  "missing",
                ];
                const aIdx = baseIdx.findIndex((v) =>
                  a.toLowerCase().includes(v)
                );
                const bIdx = baseIdx.findIndex((v) =>
                  b.toLowerCase().includes(v)
                );
                return aIdx - bIdx || a[0].localeCompare(b[0]);
              })
              .map((loc, i) => {
                const filteredGames = locator[loc].map((shelf) =>
                  shelf.map((id) => games[id]).filter(filterGames)
                );

                // hide empty sections based on filters
                if (
                  Array.isArray(filteredGames[0]) &&
                  filteredGames.every((f) => f.length === 0)
                )
                  return undefined;
                if (filteredGames.length === 0) return undefined;

                return (
                  <div className={styles.shelfContainer} key={i}>
                    <div className={styles.locationLabel}>
                      {camelToLabel(loc)}
                      <CollapseButton
                        fn={() => {
                          collapseArr[i].setExpanded((prev) => !prev);
                        }}
                        expanded={collapseArr[i].isExpanded}
                      />
                    </div>
                    <div
                      className={`${styles.container} ${
                        filters.viewStyle === "image"
                          ? styles.imagesFlex
                          : styles.textFlex
                      }`}
                      {...collapseArr[i].getCollapseProps()}
                      style={{
                        ...collapseArr[i].getCollapseProps().style,
                        flexWrap:
                          filters.sortBy === "shelf" ? undefined : "wrap",
                        flexDirection:
                          filters.sortBy === "shelf" ? "column" : "row",
                        gap: filters.sortBy === "shelf" ? "1rem" : 0,
                      }}
                    >
                      {filters.sortBy === "shelf"
                        ? filteredGames.reduce(
                            (acc: Array<ReactNode>, shelf, idx) => {
                              if (shelf.length === 0) {
                                return acc;
                              }
                              const shelfGames = shelf.map((game) => {
                                return filters.viewStyle === "image" ? (
                                  <ImageView
                                    key={game.id}
                                    game={game}
                                    numPlayers={filters.numPlayers}
                                  />
                                ) : (
                                  <TextView key={game.id} game={game} />
                                );
                              });
                              return [
                                ...acc,
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${styles.shelfNumber} ${
                                      filters.sortBy === "shelf" &&
                                      loc === "hotTable"
                                        ? styles.hide
                                        : ""
                                    }`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <div
                                    className={`${styles.oneShelfContainer} ${
                                      filters.viewStyle === "image"
                                        ? styles.imageShelf
                                        : styles.textShelf
                                    }`}
                                    style={{
                                      width:
                                        filters.viewStyle === "image"
                                          ? Math.floor(
                                              (containerRef.current
                                                ?.clientWidth || 0) / 150
                                            ) * 150 || "revert"
                                          : undefined,
                                    }}
                                  >
                                    {shelfGames}
                                  </div>
                                </div>,
                              ];
                            },
                            []
                          )
                        : filteredGames
                            .flat()
                            .sort(sortGames)
                            .map((game) => {
                              return filters.viewStyle === "image" ? (
                                <ImageView
                                  key={game.id}
                                  game={game}
                                  numPlayers={filters.numPlayers}
                                />
                              ) : (
                                <TextView key={game.id} game={game} />
                              );
                            })}
                    </div>
                  </div>
                );
              })
          : undefined}
      </div>
      <ScrollToTop />
    </>
  );
}

export default App;
