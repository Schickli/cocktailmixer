import { MachineState, MachineStatusMessage } from "@/lib/machineState";

export async function getMachineStatus() {
  // to do - implement

  return { status: MachineState.ready, message: "Cocktailmixer is ready!" } as MachineStatusMessage;
}
