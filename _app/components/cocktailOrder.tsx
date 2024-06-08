"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { FaPerson } from "react-icons/fa6";

type CocktailOrderProps = {
  className?: string;
  valueSlider: number;
};

export default function CocktailOrder({
  className,
  valueSlider,
}: CocktailOrderProps) {
return (
    <div className={className + " flex space-x-8 justify-between"}>
        <div className="w-60">
            <Accordion type="single" collapsible defaultValue="missing">
                <AccordionItem value="missing">
                    <AccordionTrigger>Missing items</AccordionTrigger>
                    <AccordionContent>
                        <div className="items-top flex space-x-2">
                            <Checkbox id="terms1" />
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Ananas
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other">
                    <AccordionTrigger>Other</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
        <div className="flex space-x-4">
            <div className="flex flex-col items-center min-h-52">
                <Slider
                    orientation="vertical"
                    className="w-20"
                    text={"30" + " %"}
                    data-vaul-no-drag
                />
                <p className="w-20 truncate text-sm mt-1 text-center">Bailys</p>
            </div>

            <div className="flex flex-col items-center min-h-52 w-20 h-full">
                <FaPerson size={40} className="h-full"/>
                <p className="w-20 truncate text-sm mt-1 text-center">Salt</p>
            </div>
        </div>
    </div>
);
}
