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

  useEffect(() => {
    fetch("https://curly-dollop-46wwp55gpgph4p7-3001.app.github.dev/config")
      .then((response) => response.json())
      .then((data) => {
        setConfig(data.bottles);
      });
  });

  return (
    <div className="min-h-screen p-2">
      <nav className="top-0 w-full flex justify-end">
        <Link href="/">
          <LuSettings size={30} />
        </Link>
      </nav>
      <div>
        {config.length > 0 && (
          <div className="flex flex-col space-y-5">
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
        {ingredients.length > 0 && (
          <div className="flex flex-col space-y-5">
            {ingredients.map((ingredient: any, index) => (
              <div className="w-full" key={index}>
                Ingrediant
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
