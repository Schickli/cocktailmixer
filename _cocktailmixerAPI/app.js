const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const config = require('./application/config.js');
const ingredients = require('./application/ingredients.js');
const cocktails = require('./application/cocktails.js');
const { open } = require('sqlite');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
    },
  },
  apis: ['./app.js'],
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());

// Connect to the database
const db_name = path.join(__dirname, "data", "cocktail.db");
let db;

async function initializeDbConnection(filename) {
    db = await open({
        filename,
        driver: sqlite3.Database
    });
}

// Call the function to initialize the database connection
initializeDbConnection(db_name).catch(error => {
    console.error(`Failed to initialize database connection: ${error.message}`);
});

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Retrieve the bottle configuration
 *     responses:
 *       200:
 *         description: Configuration object
 */
app.get('/config', async (req, res) => {
    try {
        const configData = await config.getConfig(db);
        res.send(configData);
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

app.post('/config', async (req, res) => {
    try {
        await config.setConfig(db, req.body);
        res.send('Config file has been updated');
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

app.get('/ingredients', async (req, res) => {
    try {
        const ingredientsData = await ingredients.getIngredients(db);
        res.send(ingredientsData);
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

app.get('/ingredients/:id', async (req, res) => {
    try {
        const ingredient = await ingredients.getIngredientById(db, req.params.id);
        res.send(ingredient);
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

app.get('/cocktails/possible', async (req, res) => {
    try {
        const possibleCocktails = await cocktails.getPossibleCocktails(db);
        res.send(possibleCocktails);
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
});
