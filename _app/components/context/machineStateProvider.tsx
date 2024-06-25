"use client";
import { MachineState, MachineStatusMessage } from '@/lib/machineState';
import React, { useState, createContext, ReactNode, Dispatch, SetStateAction } from 'react';
import MachineStatus from '../machineStatus';

type MachineStateContextType = {
  machineStatusMessage: MachineStatusMessage;
  setMachineStatusMessage: Dispatch<SetStateAction<MachineStatusMessage>>;
};

export const MachineStateContext = createContext<MachineStateContextType>({
  machineStatusMessage: { status: MachineState.busy, message: 'Loading...' } as MachineStatusMessage,
  setMachineStatusMessage: () => {},
});

type MachineStateProviderProps = {
  children: ReactNode;
};

export function MachineStateProvider({ children }: MachineStateProviderProps) {
  const [machineStatusMessage, setMachineStatusMessage] = useState<MachineStatusMessage>({
    status: MachineState.busy,
    message: 'Loading...',
  });

  return (
    <MachineStateContext.Provider value={{ machineStatusMessage, setMachineStatusMessage }}>
      {children}
    </MachineStateContext.Provider>
  );
}