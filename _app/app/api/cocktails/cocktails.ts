import { openDb } from "../db";
import { getConfig } from "../config/config";
import { ConfigResponse } from "@/lib/config";
import { Cocktail } from "@/lib/cocktails";

export async function getPossibleCocktails() {
  const configData = await getConfig();
  return await getCocktails(configData);
}

async function getCocktails(ingredientsData: ConfigResponse) {
  const cocktails = [];
  const db = await openDb();
  const allCocktails = await db.all(
    'SELECT * FROM cocktails WHERE strAlcoholic = "Alcoholic"'
  );
  db.close();
  for (const cocktail of allCocktails) {
    let newCocktail = { cocktail: "", idDrink: 0, ingredients: [] } as Cocktail;
    for (const option in cocktail) {
      if (option.startsWith("strIngredient")) {
        if (cocktail[option] === null || cocktail[option] === "") {
          continue;
        }

        let match = false;
        for (const configIngredient of ingredientsData.bottles) {
          if (configIngredient.name === cocktail[option]) {
            match = true;
          }
        }

        // Extract the number from the option
        let number = option.replace("strIngredient", "");

        // Add the corresponding strMeasure field to the ingredient object
        newCocktail.ingredients.push({
          ingredient: cocktail[option],
          measure: cocktail[`strMeasure${number}`],
          match: match,
        });
      }
    }

    newCocktail.cocktail = cocktail.strDrink;
    newCocktail.idDrink = cocktail.idDrink;
    cocktails.push(newCocktail);
  }

  // Sort cocktails based on the number of matches (descending order)
  cocktails.sort(
    (a, b) =>
      b.ingredients.filter((i) => i.match).length -
      a.ingredients.filter((i) => i.match).length
  );

  // Remove cocktails that have less than 2 matches
  for (let i = cocktails.length - 1; i >= 0; i--) {
    if (cocktails[i].ingredients.filter((i) => i.match).length < 2) {
      cocktails.splice(i, 1);
    }
  }

  // add the total amount of cocktails at the beginning of the array
  cocktails.unshift({ total: cocktails.length });
  return cocktails;
}
