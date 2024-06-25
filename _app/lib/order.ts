import { DetailIngredient } from "./ingredient";

export type OrderRequest = {
    idBaseDrink: number;
    ingredients: DetailIngredient[];
    glassSize: number;
};

export type OrderResponse = {
    id: number;
    idDrink: number;
    glassSize: number;
    status: string;
};