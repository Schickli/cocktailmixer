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
import { useContext } from "react";
import { MachineStateContext } from "./MachineStateProvider";

type PlaceOrder = {
  className?: string;
};

export default function PlaceOrder({ className }: PlaceOrder) {
  const { machineState, setMachineState } = useContext(MachineStateContext);

  return (
    <Drawer snapPoints={[1.4]}>
      <DrawerTrigger className="w-full">
        <Button className="w-full" disabled={machineState.status !== "ready"}>
          Order
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
