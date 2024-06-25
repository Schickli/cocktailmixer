"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { FaRegHandSpock } from "react-icons/fa6";
import { CocktailContext } from "@/components/context/cocktailProvider";
import { useContext, useEffect, useState, useCallback } from "react";
import { ConfigResponse, DetailBottle } from "@/lib/config";
import { DetailIngredient } from "@/lib/ingredient";
import { cn } from "@/lib/utils";

type CocktailOrderProps = {
  className?: string;
  drinkSize: number;
};

type DetailIngredientWithSelected = DetailIngredient & {
  selected: boolean;
};

export default function CocktailOrder({ className, drinkSize }: CocktailOrderProps) {
  const { cocktail, setCustomIngredients, customIngredients } = useContext(CocktailContext);
  const [missingIngredients, setMissingIngredients] = useState<
    DetailIngredientWithSelected[]
  >([]);
  const [ingredientsByHand, setIngredientsByHand] = useState<
    DetailIngredientWithSelected[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConfig();
        handleIngredients(data.bottles);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchData();
  }, [cocktail]);

  const getConfig = async (): Promise<ConfigResponse> => {
    try {
      const response = await fetch("http://192.168.1.169:3000/api/config");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ConfigResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching config:", error);
      throw error;
    }
  };

  const handleIngredients = useCallback(
    (config: DetailBottle[]) => {
      let withSelected = cocktail.ingredients
        .filter((ingredient) => ingredient.match)
        .map((ingredient) => ({
          ...ingredient,
          selected: true,
        })) as DetailIngredientWithSelected[];

      config.forEach((bottle) => {
        if (
          !withSelected.some(
            (ingredient) => ingredient.ingredient === bottle.name
          )
        ) {
          withSelected.push({
            ingredient: bottle.name,
            measure: "",
            match: false,
            selected: false,
          });
        }
      });

      setCustomIngredients(withSelected);
      setMissingIngredients(
        cocktail.ingredients
          .filter((ingredient) => !ingredient.match)
          .map((ingredient) => ({
            ...ingredient,
            selected: false,
          })) as DetailIngredientWithSelected[]
      );
    },
    [cocktail.ingredients]
  );

  const handleMissingIngredientChange = useCallback(
    (ingredient: DetailIngredientWithSelected) => {
      setMissingIngredients((prev) =>
        prev.map((item) =>
          item.ingredient === ingredient.ingredient
            ? { ...item, selected: !item.selected }
            : item
        )
      );

      setIngredientsByHand((prev) => {
        const exists = prev.some(
          (item) => item.ingredient === ingredient.ingredient
        );
        if (exists) {
          return prev.filter(
            (item) => item.ingredient !== ingredient.ingredient
          );
        } else {
          return [...prev, { ...ingredient, selected: !ingredient.selected }];
        }
      });
    },
    []
  );

  const handleIngredientSelectionChange = useCallback(
    (index: number, selected: boolean) => {
      setCustomIngredients(
        (prevIngredients) =>
          prevIngredients.map((prevIngredient, prevIndex) =>
            prevIndex === index
              ? { ...prevIngredient, selected }
              : prevIngredient
          ) as DetailIngredientWithSelected[]
      );
    },
    []
  );

  return (
    <div className={cn(className, "flex space-x-8 justify-between")}>
      <div className="w-60">
        <Accordion type="single" collapsible defaultValue="missing">
          <AccordionItem value="missing">
            <AccordionTrigger>Missing items</AccordionTrigger>
            <AccordionContent>
              <div className="flex space-y-2 flex-col">
                {missingIngredients.map((ingredient) => (
                  <div
                    key={ingredient.ingredient}
                    className="flex items-center space-x-2 data-vaul-no-drag"
                  >
                    <Checkbox
                      id={ingredient.ingredient}
                      checked={ingredient.selected}
                      onCheckedChange={() =>
                        handleMissingIngredientChange(ingredient)
                      }
                    />
                    <label
                      htmlFor={ingredient.ingredient}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {ingredient.ingredient}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="other">
            <AccordionTrigger>Other</AccordionTrigger>
            <AccordionContent>
              <div className="flex space-y-2 flex-col">
                {customIngredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 data-vaul-no-drag"
                  >
                    <Checkbox
                      id={ingredient.ingredient + index}
                      checked={ingredient.selected}
                      onCheckedChange={(checked) =>
                        handleIngredientSelectionChange(
                          index,
                          checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={ingredient.ingredient + index}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {ingredient.ingredient}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex space-x-4">
        {customIngredients.map((ingredient) => {
          if (!ingredient.selected) {
            return null;
          }
          return (
            <div
              className="flex flex-col items-center min-h-52"
              key={ingredient.ingredient}
            >
              <Slider
                orientation="vertical"
                className="w-20"
                text={"30" + " %"}
                data-vaul-no-drag
              />
              <p className="w-20 truncate text-sm mt-1 text-center">
                {ingredient.ingredient}
              </p>
            </div>
          );
        })}

        {ingredientsByHand.map((ingredient) => (
          <div
            className="flex flex-col items-center min-h-52 w-20 h-full"
            key={ingredient.ingredient}
          >
            <FaRegHandSpock size={40} className="h-full" />
            <p className="w-20 truncate text-sm mt-1 text-center">
              {ingredient.ingredient}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
