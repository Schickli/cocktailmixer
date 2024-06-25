"use client";
import React, { useEffect, useContext } from "react";
import { Button } from "./ui/button";
import { MachineStateContext } from "./context/machineStateProvider";
import { MachineState } from "@/lib/machineState";

export default function MachineStatus() {
  const { machineStatusMessage, setMachineStatusMessage } =
    useContext(MachineStateContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://192.168.1.169:3000/api/status", {
        signal: AbortSignal.timeout(2500),
      })
        .then((response) => response.json())
        .then((data) => {
          setMachineStatusMessage(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMachineStatusMessage({
            status: MachineState.error,
            message: "Cocktailmixer not available...",
          });
        });
    }, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [setMachineStatusMessage]);

  const statusStyles: { [key: string]: string } = {
    0: "bg-green-500",
    1: "bg-yellow-500",
    2: "bg-red-500",
  };

  return (
    <Button variant="outline" className="space-x-2">
      <div
        className={
          "w-4 h-4 rounded-full " + statusStyles[machineStatusMessage.status]
        }
      ></div>
      <span className="text-center text-sm text-muted-foreground">
        {machineStatusMessage.message}
      </span>
    </Button>
  );
}
