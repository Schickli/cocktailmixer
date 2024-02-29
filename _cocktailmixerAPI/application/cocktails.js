const config = require('./config');
const ingredients = require('./ingredients');

async function getPossibleCocktails(db) {
    const configData = await config.getConfig(db);
    const ingredientsData = await getIngredients(db, configData);
    return await getCocktails(db, ingredientsData);;
}

async function getIngredients(db, configData) {
    const ingredientsData = [];

    for (const option in configData) {
        if (option.startsWith('bottle') && configData[option] !== 0) {
            const ingredient = await ingredients.getIngredientById(db, configData[option]);
            ingredientsData.push(ingredient);
        }
    }
    return ingredientsData;
}

async function getCocktails(db, ingredientsData) {
    const cocktails = [];
    const allCocktails = await db.all('SELECT * FROM cocktails WHERE strAlcoholic = "Alcoholic"');
    for (const cocktail of allCocktails) {
        let newCocktail = { cocktail: "", idDrink: "",ingredients: [] };
        for (const option in cocktail) {
            if (option.startsWith('strIngredient')) {
                if (cocktail[option] === null) {
                    continue;
                }

                let match = false;
                for (const configIngredient of ingredientsData) {
                    if (configIngredient.strIngredient1 === cocktail[option]) {
                        match = true
                    }
                }

                // Extract the number from the option
                let number = option.replace('strIngredient', '');

                // Add the corresponding strMeasure field to the ingredient object
                newCocktail.ingredients.push({ ingredient: cocktail[option], measure: cocktail[`strMeasure${number}`], match: match });
            }
        }

        newCocktail.cocktail = cocktail.strDrink;
        newCocktail.idDrink = cocktail.idDrink;
        cocktails.push(newCocktail);
    }

    // Sort cocktails based on the number of matches (descending order)
    cocktails.sort((a, b) => b.ingredients.filter(i => i.match).length - a.ingredients.filter(i => i.match).length);

    // Remove cocktails that have less than 2 matches
    for (let i = cocktails.length - 1; i >= 0; i--) {
        if (cocktails[i].ingredients.filter(i => i.match).length < 2) {
            cocktails.splice(i, 1);
        }
    }

    // add the total amount of cocktails at the beginning of the array
    cocktails.unshift({ total: cocktails.length });
    return cocktails;
}

module.exports = {
    getPossibleCocktails,
};
