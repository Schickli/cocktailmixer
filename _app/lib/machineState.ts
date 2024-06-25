export enum MachineState {
  ready,
  busy,
  error,
}

export type MachineStatusMessage = {
  status: MachineState;
  message: string;
};
