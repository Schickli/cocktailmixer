"use client";
import React, { useState, createContext, ReactNode, Dispatch, SetStateAction } from 'react';

type MachineState = {
  status: string;
  message: string;
};

type MachineStateContextType = {
  machineState: MachineState;
  setMachineState: Dispatch<SetStateAction<MachineState>>;
};

export const MachineStateContext = createContext<MachineStateContextType>({
  machineState: { status: 'busy', message: 'Loading...' },
  setMachineState: () => {},
});

type MachineStateProviderProps = {
  children: ReactNode;
};

export function MachineStateProvider({ children }: MachineStateProviderProps) {
  const [machineState, setMachineState] = useState<MachineState>({
    status: 'busy',
    message: 'Loading...',
  });

  return (
    <MachineStateContext.Provider value={{ machineState, setMachineState }}>
      {children}
    </MachineStateContext.Provider>
  );
}