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
import { MachineStateContext } from "./machineStateProvider";
import CocktailSizeChooser from "./cocktailSizeChooser";
import { FaAngleRight } from "react-icons/fa";
import CocktailOrder from "./cocktailOrder";

type PlaceOrder = {
  className?: string;
};

export default function PlaceOrder({ className }: PlaceOrder) {
  const { machineState } = useContext(MachineStateContext);
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

  return (
    <Drawer onClose={reset}>
      <DrawerTrigger className="w-full">
        <Button className="w-full" disabled={machineState.status !== "ready"}>
          Order
        </Button>
      </DrawerTrigger>
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
          <CocktailOrder className="p-4" valueSlider={valueSlider} />
        )}
        <DrawerFooter className="flex justify-end">
          <DrawerClose>
            <Button variant={"ghost"}>Cancel</Button>
          </DrawerClose>
          {page === "size" ? (
            <Button size={"lg"} onClick={() => setPage("order")}>
              Continue <FaAngleRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <DrawerClose>
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
