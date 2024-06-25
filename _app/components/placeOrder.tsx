"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { MachineStateContext } from "./context/machineStateProvider";
import CocktailSizeChooser from "./cocktailSizeChooser";
import { FaAngleRight } from "react-icons/fa";
import CocktailOrder from "./cocktailOrder";
import { CocktailContext } from "./context/cocktailProvider";
import { MachineState } from "@/lib/machineState";

type PlaceOrder = {
  className?: string;
};

export default function PlaceOrder({ className }: PlaceOrder) {
  const { machineStatusMessage } = useContext(MachineStateContext);
  const { cocktail, customIngredients } =
    useContext(CocktailContext);
  const [page, setPage] = useState("size" as "size" | "order");
  const [valueSlider, setValueSlider] = useState(200);


  let title = "Cocktail size";
  let description =
    "Please choose the size of your cocktail according to the size of your glass!";

  if (page === "order") {
    title = "Order";
    description = "Please customize your cocktail!";
  }

  function reset() {
    setPage("size");
  }

  function order() {
    let orderBody = {
      idBaseDrink: cocktail.idDrink,
      ingredients: customIngredients,
      glassSize: valueSlider,
    };

    fetch("http://192.168.1.169:3000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <Drawer onClose={reset}>
      <Button
        className="w-full"
        disabled={machineStatusMessage.status !== MachineState.ready}
        asChild
      >
        <DrawerTrigger className="w-full">Order</DrawerTrigger>
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {page === "size" ? (
          <CocktailSizeChooser
            className="p-4"
            valueSlider={valueSlider}
            setValueSlider={setValueSlider}
          />
        ) : (
          <CocktailOrder className="p-4" drinkSize={valueSlider} />
        )}
        <DrawerFooter className="flex justify-end">
          <DrawerClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DrawerClose>
          {page === "size" ? (
            <Button size={"lg"} onClick={() => setPage("order")}>
              Continue <FaAngleRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <DrawerClose asChild onClick={order} disabled={machineStatusMessage.status !== MachineState.ready}>
              <Button size={"lg"}>
                Order <FaAngleRight className="h-4 w-4 ml-2" />
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
