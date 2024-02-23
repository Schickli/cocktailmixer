async function setConfig(db, config) {
    await createConfigTable(db);
    await insertConfig(db, config);
}

async function createConfigTable(db) {
    const sql_create = `CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bottle1 INTEGER,
        bottle2 INTEGER,
        bottle3 INTEGER,
        bottle4 INTEGER,
        bottle5 INTEGER,
        bottle6 INTEGER,
        FOREIGN KEY (bottle1) REFERENCES ingredients (id),
        FOREIGN KEY (bottle2) REFERENCES ingredients (id),
        FOREIGN KEY (bottle3) REFERENCES ingredients (id),
        FOREIGN KEY (bottle4) REFERENCES ingredients (id),
        FOREIGN KEY (bottle5) REFERENCES ingredients (id),
        FOREIGN KEY (bottle6) REFERENCES ingredients (id)
    )`;

    await db.run(sql_create);
    console.log("Successful creation of the 'config' table");
}

async function insertConfig(db, config) {
    const sql_insert = `INSERT INTO config (bottle1, bottle2, bottle3, bottle4, bottle5, bottle6) VALUES (?, ?, ?, ?, ?, ?)`;

    await db.run(sql_insert, [config.bottle1, config.bottle2, config.bottle3, config.bottle4, config.bottle5, config.bottle6]);
    console.log("Successful insertion of the config");
}

async function getConfig(db) {
    const sql_select = `SELECT * FROM config ORDER BY id DESC LIMIT 1`;

    const row = await db.get(sql_select, []);

    return row;
}

module.exports = {
    setConfig,
    getConfig
};
