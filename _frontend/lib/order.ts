export type OrderRequest = {
    idDrink: number;
    glassSize: number;
};

export type OrderResponse = {
    id: number;
    idDrink: number;
    glassSize: number;
    status: string;
};