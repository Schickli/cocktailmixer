import { openDb } from "../db";
import { Ingredient } from "../../../lib/ingredient";
import { Cocktail } from "@/lib/cocktails";

export async function getIngredients() {
    const db = await openDb();
    const sql_select = `SELECT * FROM ingredients`;

    try {
        const rows = await db.all(sql_select, []);
        db.close();
        return rows;
    } catch (err) {
        throw err;
    }

}

export async function getIngredientById(id: number) {
    const db = await openDb();

    const sql_select = `SELECT * FROM ingredients WHERE id = ?`;

    try {
        const row = await db.get(sql_select, [id]);
        if (row === undefined) {
            throw new Error("Ingredient not found");
        }
        db.close();
        return row;
    } catch (err) {
        throw err;
    }

}

export async function searchIngredients(query: string) {
    const db = await openDb();
    const sql_select = `SELECT * FROM ingredients WHERE strIngredient1 LIKE ?`;
    const params = [`%${query}%`];

    try {
        const rows = await db.all(sql_select, params);
        db.close();
        return rows;
    } catch (err) {
        throw err;
    }

}

export async function getMostUsedIngredients() {
    const db = await openDb();

    const sql_select = `SELECT * FROM cocktails WHERE strAlcoholic = "Alcoholic"`;
    const cocktails: any[] = await db.all(sql_select, []); // create db cocktail type

    let ingredientCounts: { [key: string]: { count: number } } = {};

    for (const cocktail of cocktails) {
        for (const option in cocktail) {
            if (option.startsWith('strIngredient') && cocktail[option] !== null) {
                const ingredient = cocktail[option];
                if (!ingredientCounts[ingredient]) {
                    ingredientCounts[ingredient] = { count: 0 };
                }
                ingredientCounts[ingredient].count++;
            }
        }
    }

    const sortedIngredients = Object.keys(ingredientCounts).sort((a, b) => ingredientCounts[b].count - ingredientCounts[a].count);

    db.close();

    return sortedIngredients.map(ingredient => ({
        ingredient,
        count: ingredientCounts[ingredient].count,
    }));
}