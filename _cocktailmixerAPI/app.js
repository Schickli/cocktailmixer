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
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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

/**
 * @swagger
 * /config:
 *   post:
 *     summary: Set the bottle configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bottle1:
 *                 type: integer
 *               bottle2:
 *                 type: integer
 *               bottle3:
 *                 type: integer
 *               bottle4:
 *                 type: integer
 *               bottle5:
 *                 type: integer
 *               bottle6:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Config file has been updated
 */
app.post('/config', async (req, res) => {
    try {
        await config.setConfig(db, req.body);
        res.send('Config file has been updated');
    } catch (error) {
        if (error.message === "Config is empty or undefined") {
            console.log(error);
            res.status(400).send('Config is empty or undefined');
        } else {
            console.log(error);
            res.status(505).send('Error occurred');
        }
    }
});

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Retrieve all ingredients
 *     responses:
 *       200:
 *         description: Ingredients list
 */
app.get('/ingredients', async (req, res) => {
    try {
        const ingredientsData = await ingredients.getIngredients(db);
        res.send(ingredientsData);
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

/**
 * @swagger
 * /ingredients/mostUsed:
 *   get:
 *     summary: Retrieve the most popular ingredients
 *     responses:
 *       200:
 *         description: Ingredients list
 */
app.get('/ingredients/mostUsed', async (req, res) => {
    try {
        const ingredientsData = await ingredients.getMostUsedIngredients(db);
        res.send(ingredientsData);
    } catch (error) {
        console.log(error);
        res.status(505).send('Error occurred');
    }
});

/**
 * @swagger
 * /ingredients/{id}:
 *   get:
 *     summary: Retrieve ingredient by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: id of the ingredient
 *     responses:
 *       200:
 *         description: Ingredient object
 */
app.get('/ingredients/:id', async (req, res) => {
    try {
        if(isNaN(req.params.id)) {
            res.status(400).send('Id must be a number');
            return;
        }
        const ingredient = await ingredients.getIngredientById(db, req.params.id);
        res.send(ingredient);
    } catch (error) {
        if (error.message === "Ingredient not found") {
            console.log(error);
            res.status(404).send('Ingredient not found');
        } else {
            console.log(error);
            res.status(505).send('Error occurred');
        }
    }
});

/**
 * @swagger
 * /cocktails/possible:
 *   get:
 *     summary: Retrieve possible cocktails based on the current bottle configuration
 *     responses:
 *       200:
 *         description: Cocktail list
 */
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
