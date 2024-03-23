"use client";

import { LuSettings } from "react-icons/lu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CocktailSelection() {
  const [config, setConfig] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [search, setSearch] = useState("");

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
        setIngredients(data);
        setFilterItems(data);
        sortItemsByAlphabet();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function filterItemsBySearch(value: string) {
    if (value === "" || value.length < 2) {
      setSearch("");
      setFilterItems(ingredients);
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

  function sortItemsByAlphabet() {
    const sortedItems = filterItems.sort((a: any, b: any) =>
      a.strIngredient1.localeCompare(b.strIngredient1)
    );

    setFilterItems(sortedItems);
  }

  return (
    <div className="min-h-screen p-2">
      <nav className="top-0 w-full flex justify-end">
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
                    <Button>Select</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full">
          {filterItems.length > 0 && (
            <div className="flex flex-wrap">
              <Input
                className="w-full mb-4"
                value={search}
                onChange={(e) => filterItemsBySearch(e.target.value)}
              />
              <div className="overflow-y-scroll h-[21.5rem] w-full flex-wrap flex">
                {filterItems.map((ingredient: any, index) => (
                  <div
                    className="w-min text-nowrap py-2 px-4 border-2 rounded border-slate-200 m-1 h-min"
                    key={index}
                  >
                    <Label htmlFor={ingredient.name}>
                      {ingredient.strIngredient1}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
