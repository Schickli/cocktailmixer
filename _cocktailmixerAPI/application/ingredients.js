async function getIngredients(db) {
    const sql_select = `SELECT * FROM ingredients`;

    try {
        const rows = await db.all(sql_select, []);
        return rows;
    } catch (err) {
        throw err;
    }
}

async function getIngredientById(db, id) {
    const sql_select = `SELECT * FROM ingredients WHERE id = ?`;

    try {
        const row = await db.get(sql_select, [id]);
        if (row === undefined) {
            throw new Error("Ingredient not found");
        }
        return row;
    } catch (err) {
        throw err;
    }
}

async function getMostUsedIngredients(db) {

    // Hole alle Cocktails
    const sql_select = `SELECT * FROM cocktails WHERE strAlcoholic = "Alcoholic"`;
    const cocktails = await db.all(sql_select, []);

    let ingredientCounts = {};

    // Durchlaufe alle Cocktails
    for (const cocktail in cocktails) {
        for (const option in cocktails[cocktail]) {
            if (option.startsWith('strIngredient')) {
                if (cocktails[cocktail][option] === null) {
                    continue;
                }
                if (!ingredientCounts[cocktails[cocktail][option]]) {
                    ingredientCounts[cocktails[cocktail][option]] = {
                        count: 0,
                        cocktails: []
                    };
                }

                ingredientCounts[cocktails[cocktail][option]].count++;
            }
        }
    }

    // Sortiere die Zutaten basierend auf ihrer Häufigkeit (absteigende Reihenfolge)
    let sortedIngredients = Object.keys(ingredientCounts).sort((a, b) => ingredientCounts[b].count - ingredientCounts[a].count);

    // Gib die am häufigsten verwendeten Zutaten zurück
    return sortedIngredients.map(ingredient => ({
        ingredient,
        count: ingredientCounts[ingredient].count,
    }));
}

module.exports = {
    getIngredients,
    getIngredientById,
    getMostUsedIngredients
};