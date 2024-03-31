"use client";

import { LuSettings } from "react-icons/lu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LiaSave } from "react-icons/lia";

export default function CocktailSelection() {
  const [config, setConfig] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeBottle, setActiveBottle] = useState("");
  const [activeIngredient, setActiveIngredient] = useState(0);

  useEffect(() => {
    fetch("http://192.168.1.169:3001/config")
      .then((response) => response.json())
      .then((data) => {
        setConfig(data.bottles);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch("http://192.168.1.169:3001/ingredients")
      .then((response) => response.json())
      .then((data) => {
        let sorted = sortItemsByAlphabet(data);
        setIngredients(sorted);
        setFilterItems(sorted);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function save() {
    const formattedConfig = config.reduce((acc: any, item: any, i: number) => {
      acc[`bottle${i + 1}`] = item.idIngrediant;
      return acc;
    }, {});
    console.log(formattedConfig);

    fetch("http://192.168.1.169:3001/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([formattedConfig]),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function filterItemsBySearch(value: string) {
    if (value === "" || value.length < 2) {
      setSearch(value);
      setFilterItems(ingredients);
      return;
    }

    fetch("http://192.168.1.169:3001/ingredients/search?name=" + value)
      .then((response) => response.json())
      .then((data) => {
        setFilterItems(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setSearch(value);
  }

  function sortItemsByAlphabet(data: any) {
    const sortedItems = data.sort((a: any, b: any) =>
      a.strIngredient1.localeCompare(b.strIngredient1)
    );

    return sortedItems;
  }

  function selectBottle(bottle: string) {
    if (activeIngredient !== 0) {
      config.map((item: any) => {
        if (item.position === bottle) {
          item.idIngrediant = activeIngredient;
          const selectedIngredient = ingredients.find(
            (ingredient: any) => ingredient.id === activeIngredient
          );
          item.name = selectedIngredient
            ? (selectedIngredient as any).strIngredient1
            : "";
        }
      });

      setActiveBottle("");
      setActiveIngredient(0);
      return;
    }

    if (bottle === activeBottle) {
      setActiveBottle("");
      return;
    }

    setActiveBottle(bottle);
  }

  function selectIngredient(ingredient: number) {
    if (activeBottle != "") {
      config.map((item: any) => {
        if (item.position === activeBottle) {
          item.idIngrediant = ingredient;
          const selectedIngredient = ingredients.find(
            (i: any) => i.id === ingredient
          );
          item.name = selectedIngredient
            ? (selectedIngredient as any).strIngredient1
            : "";
        }
      });

      setActiveBottle("");
      setActiveIngredient(0);
      return;
    }

    if (ingredient === activeIngredient) {
      setActiveIngredient(0);
      return;
    }

    setActiveIngredient(ingredient);
  }

  return (
    <div className="min-h-screen p-2">
      <nav className="top-0 w-full flex justify-end">
        <div className="mr-5" onClick={save}>
          <LiaSave size={30} />
        </div>
        <Link href="/">
          <LuSettings size={30} />
        </Link>
      </nav>
      <div className="flex mt-5">
        <div className="mr-5">
          {config.length > 0 && (
            <div className="flex flex-col space-y-2">
              {config.map((bottle: any, index) => (
                <div className="w-full" key={index}>
                  <Label htmlFor={bottle.position}>{bottle.position}</Label>
                  <div className="flex space-x-3">
                    <Input
                      value={bottle.name}
                      className="w-48"
                      id={bottle.position}
                    />
                    <Button
                      variant="outline"
                      className={
                        activeBottle === bottle.position
                          ? "border-2 border-slate-900"
                          : "border-slate-200"
                      }
                      onClick={() => selectBottle(bottle.position)}
                    >
                      {activeIngredient === 0 ? "Select" : "Assign"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="flex flex-wrap">
            <Input
              className="w-full mb-4"
              value={search}
              onChange={(e) => filterItemsBySearch(e.target.value)}
              placeholder="Search for ingredients"
            />
            {filterItems.length > 0 ? (
              <div className="overflow-y-scroll max-h-[21.5rem] w-full flex-wrap flex h-min">
                <div
                  className={`w-min text-nowrap py-2 px-4 border-2 rounded  m-1 h-min ${
                    activeIngredient === -1
                      ? "border-slate-900 bg-gray-50"
                      : "border-slate-200"
                  }`}
                  onClick={() => selectIngredient(-1)}
                >
                  <Label>No ingredient</Label>
                </div>
                {filterItems.map((ingredient: any, index) => (
                  <div
                    className={`w-min text-nowrap py-2 px-4 border-2 rounded  m-1 h-min hover:bg-slate-100 ${
                      activeIngredient === ingredient.id
                        ? "border-slate-900 bg-gray-50"
                        : "border-slate-200"
                    }`}
                    key={index}
                    onClick={() => selectIngredient(ingredient.id)}
                  >
                    <Label htmlFor={ingredient.name}>
                      {ingredient.strIngredient1}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center h-32">
                <p className="text-slate-300">No ingredients found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
