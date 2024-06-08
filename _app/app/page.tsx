"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { LuSettings } from "react-icons/lu";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cocktail } from "@/lib/cocktails";
import { DetailIngredient } from "@/lib/ingredient";
import MachineStatus from "@/components/machineStatus";
import PlaceOrder from "@/components/placeOrder";

export default function CocktailSelection() {
  const [cocktails, setCocktails] = useState([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://192.168.1.169:3000/api/cocktails/possible")
      .then((response) => response.json())
      .then((data) => {
        setCount(data.shift().total);
        setCocktails(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <nav className="top-0 w-full flex justify-end p-2 items-center space-x-5 mb-3">
        <Button
          variant="outline"
          className="text-center text-sm text-muted-foreground"
        >
          Cocktail {current} of {count} possible
        </Button>
        <MachineStatus />
        <Button variant="secondary" asChild>
          <Link href="/settings" className="justify-end">
            <LuSettings size={20} />
          </Link>
        </Button>
      </nav>

      <div className="flex justify-center align-middle">
        {count > 0 ? (
          <Carousel setApi={setApi}>
            <CarouselContent className="max-w-[43.5rem]">
              {cocktails.map((drink: Cocktail, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <div className="flex">
                      <div className="w-1/2">
                        <CardHeader>
                          <CardTitle>{drink.cocktail}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center ">
                          <Image
                            src={"/images/" + drink.idDrink + ".jpg"}
                            alt={drink.cocktail}
                            width={800}
                            height={800}
                            className="rounded-lg"
                          />
                        </CardContent>
                      </div>

                      <div className="w-full">
                        <CardHeader>
                          <CardTitle>Ingrediants</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                          <CardDescription className="grid grid-cols-2 gap-4 mb-5 w-full pt-5">
                            {drink.ingredients.map(
                              (ingredient: DetailIngredient, index: number) => (
                                <div key={index} className="flex flex-row">
                                  {ingredient.match ? (
                                    <b className="text-green-500">
                                      {ingredient.ingredient}
                                    </b>
                                  ) : (
                                    <b>{ingredient.ingredient}</b>
                                  )}
                                  <span className="ml-1">
                                    {ingredient.measure}
                                  </span>
                                </div>
                              )
                            )}
                          </CardDescription>
                        </CardContent>
                      </div>
                    </div>
                    <CardFooter className="flex flex-col">
                      <PlaceOrder />
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-center text-slate-300">
            No cocktails available
          </div>
        )}
      </div>
    </div>
  );
}
