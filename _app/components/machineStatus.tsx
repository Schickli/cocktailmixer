"use client";
import React, { useEffect, useContext } from "react";
import { Button } from "./ui/button";
import { MachineStateContext } from "./machineStateProvider";
const baseUrl = window.location.origin;

const statusStyles = {
  ready: "bg-green-500",
  busy: "bg-yellow-500",
  error: "bg-red-500",
};

export default function MachineStatus() {
  const { machineState, setMachineState } = useContext(MachineStateContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(baseUrl+"/api/status", { signal: AbortSignal.timeout(2500)  })
        .then((response) => response.json())
        .then((data) => {
          setMachineState(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setMachineState({
        status: "error",
        message: "Cocktailmixer not available...",
          });
        });
    }, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [setMachineState]);

  const statusStyles: { [key: string]: string } = {
    ready: "bg-green-500",
    busy: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <Button variant="outline" className="space-x-2">
      <div className={"w-4 h-4 rounded-full " + statusStyles[machineState.status]}></div>
      <span className="text-center text-sm text-muted-foreground">
        {machineState.message}
      </span>
    </Button>
  );
}
