"use client";
import { Cocktail } from "@/lib/cocktails";
import { DetailIngredient } from "@/lib/ingredient";
import React, {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type DetailIngredientWithSelected = DetailIngredient & {
  selected: boolean;
};

type CocktailContextType = {
  cocktail: Cocktail;
  setCocktail: Dispatch<SetStateAction<Cocktail>>;
  customIngredients: DetailIngredientWithSelected[];
  setCustomIngredients: Dispatch<SetStateAction<DetailIngredientWithSelected[]>>;
};


export const CocktailContext = createContext<CocktailContextType>({
  cocktail: {} as Cocktail,
  setCocktail: () => {},
  customIngredients: [],
  setCustomIngredients: () => {},
});

type MachineStateProviderProps = {
  children: ReactNode;
};

export function CocktailProvider({ children }: MachineStateProviderProps) {
  const [cocktail, setCocktail] = useState<Cocktail>({} as Cocktail);
  const [customIngredients, setCustomIngredients] = useState<DetailIngredientWithSelected[]>([]);

  return (
    <CocktailContext.Provider
      value={{ cocktail, setCocktail, customIngredients, setCustomIngredients }}
    >
      {children}
    </CocktailContext.Provider>
  );
}
