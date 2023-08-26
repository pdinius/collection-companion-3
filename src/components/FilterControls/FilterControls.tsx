import { FC, useState } from "react";
import styles from "./FilterControls.module.scss";
import { Toggle } from "../Toggle/Toggle";

const sortOptions = {
  shelf: "Shelf",
  alpha: "Alphabetically",
  bgg_rank: "BGG Rank",
  avg_rating: "Average Rating",
  play_time: "Min Play Time",
  complexity: "Complexity",
  phils_rating: "Phil's Rating",
} as const;

const defaultDir: { [key in keyof typeof sortOptions]: "asc" | "desc" } = {
  shelf: "desc",
  alpha: "asc",
  bgg_rank: "desc",
  avg_rating: "desc",
  play_time: "asc",
  complexity: "asc",
  phils_rating: "desc",
};

export type Filters = {
  viewStyle: "text" | "image";
  sortBy: keyof typeof sortOptions;
  sortDir: "asc" | "desc";
  numPlayers?: number;
  min_complexity?: number;
  max_complexity?: number;
  searchQuery?: string;
  onlyBestWith?: boolean;
};

export interface FilterControlsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const FilterControls: FC<FilterControlsProps> = ({
  filters,
  setFilters,
}) => {
  const [playerCount, setPlayerCount] = useState<number>();

  const updateSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as keyof typeof sortOptions;
    setFilters((prev) => ({
      ...prev,
      sortBy: val,
      sortDir: defaultDir[val],
    }));
  };

  const toggleDir = () => {
    setFilters((prev) => ({
      ...prev,
      sortDir: prev.sortDir === "asc" ? "desc" : "asc",
    }));
  };

  const toggleView = () => {
    setFilters((prev) => ({
      ...prev,
      viewStyle: prev.viewStyle === "text" ? "image" : "text",
    }));
  };

  const updatePlayerCount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    if (/^\d+$/.test(val)) {
      setPlayerCount(Number(val));
      setFilters((prev) => ({
        ...prev,
        numPlayers: Number(val),
      }));
    }
    if (val === "") {
      setPlayerCount(undefined);
      setFilters((prev) => ({
        ...prev,
        numPlayers: undefined,
      }));
    }
  };

  const updateSearchQuery: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    setFilters((prev) => ({
      ...prev,
      searchQuery: val,
    }));
  };

  return (
    <div className={styles.filterControls}>
      <div className={styles.filterRow}>
        <div className={styles.searchQueryContainer}>
          <input
            value={filters.searchQuery ?? ""}
            onChange={updateSearchQuery}
            className={styles.queryInput}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={styles.magnifyingGlass}
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
        <Toggle
          testForLeft={() => filters.viewStyle === "text"}
          leftItem="Text"
          rightItem="Images"
          trigger={toggleView}
        />
        <div>
          Player Count:&emsp;
          <input
            value={playerCount ?? ""}
            onChange={updatePlayerCount}
            maxLength={2}
            className={styles.playerCountInput}
          />
        </div>
        <Toggle
          testForLeft={() => !filters.onlyBestWith}
          leftItem="All"
          rightItem="Best"
          trigger={() => {
            setFilters((prev) => ({
              ...prev,
              onlyBestWith: !prev.onlyBestWith,
            }));
          }}
          disabled={filters.numPlayers === undefined}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.filterRow}>
        <div>
          Sort by:&emsp;
          <select onChange={updateSort}>
            {Object.keys(sortOptions)
              .map((so, i) => (
                <option key={i} value={so}>
                  {sortOptions[so as keyof typeof sortOptions]}
                </option>
              ))}
          </select>
        </div>
        <Toggle
          testForLeft={() => filters.sortDir === "asc"}
          leftItem={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.caret}
              viewBox="0 0 320 512"
            >
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
          }
          rightItem={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.caret}
              viewBox="0 0 320 512"
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          }
          trigger={toggleDir}
        />
      </div>
    </div>
  );
};
