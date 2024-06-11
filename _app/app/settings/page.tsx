"use client";

import { LuSettings } from "react-icons/lu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LiaSave } from "react-icons/lia";
import { Ingredient } from "@/lib/ingredient";
import Loader from "@/components/loader";
import { ConfigRequest, ConfigResponse, DetailBottle } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function CocktailSelection() {
  const router = useRouter();
  const [config, setConfig] = useState<DetailBottle[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterItems, setFilterItems] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [activeBottle, setActiveBottle] = useState("");
  const [activeIngredient, setActiveIngredient] = useState(-1);
  const baseUrl = window.location.origin;

  useEffect(() => {
    setLoading(true);
    fetch(baseUrl+"/api/config")
      .then((response) => response.json())
      .then((data: ConfigResponse) => {
        setConfig(data.bottles);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    fetch(baseUrl+"/api/ingredients")
      .then((response) => response.json())
      .then((data) => {
        let sorted = sortItemsByAlphabet(data);
        setIngredients(sorted);
        setFilterItems(sorted);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function save() {
    setLoading(true);
    const formattedConfig = config.reduce((acc: any, item: any, i: number) => {
      acc[`bottle${i + 1}`] = item.idIngrediant;
      return acc;
    }, {} as ConfigRequest);

    
    fetch(baseUrl+"/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([formattedConfig]),
    })
      .then((data) => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function filterItemsBySearch(value: string) {
    if (value === "" || value.length < 2) {
      setSearch(value);
      setFilterItems(ingredients);
      return;
    }

    setLoading(true);
    
    fetch(baseUrl+"/api/ingredients/search?name=" + value)
      .then((response) => response.json())
      .then((data) => {
        setFilterItems(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    setSearch(value);
  }

  function sortItemsByAlphabet(data: Ingredient[]) {
    const sortedItems = data.sort((a: Ingredient, b: Ingredient) =>
      a.strIngredient1.localeCompare(b.strIngredient1)
    );

    return sortedItems;
  }

  function selectBottle(bottle: string) {
    if (activeIngredient !== -1) {
      config.map((item: DetailBottle) => {
        if (item.position === bottle) {
          item.idIngrediant = activeIngredient;
          const selectedIngredient = ingredients.find(
            (ingredient: Ingredient) => ingredient.id === activeIngredient
          );
          item.name = selectedIngredient
            ? (selectedIngredient as Ingredient).strIngredient1
            : "";
        }
      });

      setActiveBottle("");
      setActiveIngredient(-1);
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
      config.map((item: DetailBottle) => {
        if (item.position === activeBottle) {
          item.idIngrediant = ingredient;
          const selectedIngredient = ingredients.find(
            (i: Ingredient) => i.id === ingredient
          );
          item.name = selectedIngredient
            ? (selectedIngredient as Ingredient).strIngredient1
            : "";
        }
      });

      setActiveBottle("");
      setActiveIngredient(-1);
      return;
    }

    if (ingredient === activeIngredient) {
      setActiveIngredient(-1);
      return;
    }

    setActiveIngredient(ingredient);
  }

  return (
    <div className="min-h-screen p-2">
      <nav className="top-0 w-full flex justify-end items-center">
        {loading && <Loader className="mr-5" />}
        <Button className="mr-5" onClick={save} disabled={loading}>
          <LiaSave size={20} />
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">
            <LuSettings size={20} />
          </Link>
        </Button>
      </nav>
      <div className="flex mt-5">
        <div className="mr-5">
          {config.length > 0 && (
            <div className="flex flex-col space-y-2">
              {config.map((bottle: DetailBottle, index) => (
                <div className="w-full" key={index}>
                  <Label htmlFor={bottle.position}>{bottle.position}</Label>
                  <div className="flex space-x-3">
                    <Input
                      value={bottle.name}
                      className="w-48"
                      id={bottle.position}
                      readOnly
                      onClick={() => selectBottle(bottle.position)}
                    />
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
                    activeIngredient === 0
                      ? "border-slate-900 bg-gray-50"
                      : "border-slate-200"
                  }`}
                  onClick={() => selectIngredient(0)}
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
