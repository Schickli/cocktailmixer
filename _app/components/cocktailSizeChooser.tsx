"use client";
import { Slider } from "@/components/ui/slider";
import { Button } from "./ui/button";
import { useState } from "react";

type CocktailSizeChooserProps = {
  className?: string;
  valueSlider: number;
  setValueSlider: (value: number) => void;
};

export default function CocktailSizeChooser({
  className,
  valueSlider,
  setValueSlider,
}: CocktailSizeChooserProps) {

  return (
    <div className={className + " flex justify-center flex-col"}>
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-center">
          {valueSlider} ml
        </h1>
        <div className="space-x-4">
          <Button variant={"outline"} onClick={() => setValueSlider(100)}>
            100ml
          </Button>
          <Button variant={"outline"} onClick={() => setValueSlider(200)}>
            200ml
          </Button>
          <Button variant={"outline"} onClick={() => setValueSlider(300)}>
            300ml
          </Button>
        </div>
      </div>
      <Slider
        min={20}
        max={500}
        step={20}
        value={[valueSlider]}
        onValueChange={(value) => setValueSlider(value[0])}
        className="mb-8"
      />
    </div>
  );
}
