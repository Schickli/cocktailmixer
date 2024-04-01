export type ConfigResponse = {
  bottles: DetailBottle[];
};

export type DetailBottle = {
  position: string;
  idIngrediant: number;
  name: string;
};

export type ConfigRequest = {
    bottle1: number;
    bottle2: number;
    bottle3: number;
    bottle4: number;
    bottle5: number;
    bottle6: number;
};
