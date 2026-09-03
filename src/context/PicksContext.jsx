import { createContext, useContext, useState } from "react";

const PicksContext = createContext();

export function PicksProvider({ children }) {
  const [picks, setPicks] = useState([]);

  const addPick = (prediction) => {
    setPicks((current) => {
      // Don't allow the same fixture to be added twice
      const exists = current.some(
        (pick) => pick.id === prediction.id
      );

      if (exists) {
        return current;
      }

      return [...current, prediction];
    });
  };

  const removePick = (id) => {
    setPicks((current) =>
      current.filter((pick) => pick.id !== id)
    );
  };

  const clearPicks = () => {
    setPicks([]);
  };

  const isPicked = (id) => {
    return picks.some((pick) => pick.id === id);
  };

  return (
    <PicksContext.Provider
      value={{
        picks,
        addPick,
        removePick,
        clearPicks,
        isPicked,
      }}
    >
      {children}
    </PicksContext.Provider>
  );
}

export function usePicks() {
  return useContext(PicksContext);
}