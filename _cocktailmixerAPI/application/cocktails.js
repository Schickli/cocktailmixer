const config =  require('./config');
const ingredients = require('./ingredients');

async function getPossibleCocktails(db) {
    const configData = await config.getConfig(db);
    const ingredientsData = await getIngredients(db, configData);
    return ingredientsData;
}

async function getIngredients(db, configData) {
    const ingredientsData = [];
    for (let i = 0; i < configData.length; i++) {
        console.log(configData[i]);
        const ingredient = await ingredients.getIngredientById(db, configData[i]);
        ingredientsData.push(ingredient);
    }
    return ingredientsData;
}

module.exports = {
  getPossibleCocktails
};
