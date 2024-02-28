import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../components/ui/button";
import { LuSettings } from "react-icons/lu";

export default function CocktailSelection() {

  


  return (
    <main className="min-h-screen">
      <nav className="top-0 w-full flex justify-end p-16">
        <LuSettings size={30} />
      </nav>
      <div className="w-full h-full flex justify-center align-middle">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <Button>Click me</Button>
            </CarouselItem>
            <CarouselItem>...</CarouselItem>
            <CarouselItem>...</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </main>
  );
}
