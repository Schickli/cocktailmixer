const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const config = require('./application/config.js');

const path = require('path');

// Connect to the database
const db_name = path.join(__dirname, "data", "cocktail.db");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'cocktail.db'");
});

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/config', (req, res) => {
    try {
        config.setConfig(db, req.body);
        res.send('Config file has been updated');
    }
    catch (error) {
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