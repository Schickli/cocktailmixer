async function setConfig(db, config) {
    await createConfigTable(db);
    await insertConfig(db, config);
    await deleteConfigWhenOverTen(db);
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
    if(config.bottle1 === undefined || config.bottle2 === undefined || config.bottle3 === undefined || config.bottle4 === undefined || config.bottle5 === undefined || config.bottle6 === undefined) {
        throw new Error("Config is empty or undefined");
    }

    const sql_insert = `INSERT INTO config (bottle1, bottle2, bottle3, bottle4, bottle5, bottle6) VALUES (?, ?, ?, ?, ?, ?)`;

    await db.run(sql_insert, [config.bottle1, config.bottle2, config.bottle3, config.bottle4, config.bottle5, config.bottle6]);
    console.log("Successful insertion of the config");
}

async function deleteConfigWhenOverTen(db) {
    const sql_select = `SELECT COUNT(*) FROM config`;

    const count = await db.get(sql_select, []);

    if (count['COUNT(*)'] > 10) {
        const sql_delete = `DELETE FROM config WHERE id NOT IN (SELECT id FROM config ORDER BY id DESC LIMIT 10)`;

        await db.run(sql_delete, []);
        console.log("Successful deletion of the configurations except the latest 10");
    }
}

async function getConfig(db) {
    const sql_select = `SELECT * FROM config ORDER BY id DESC LIMIT 1`;

    const row = await db.get(sql_select, []);
    const config = {};
    const bottles = [];

    for (let i = 1; i <= 6; i++) {
        if (row["bottle" + i] === null || row["bottle" + i] === 0) {
            bottles.push({position: "Bottle " + i,idIngrediant: 0, name: ""});
            continue;
        }

        const sql_select = `SELECT strIngredient1 FROM ingredients WHERE id = ?`;
        const row2 = await db.get(sql_select, [row["bottle" + i]]);
        bottles.push({
            position: "Bottle " + i,
            idIngrediant: row["bottle" + i],
            name: row2.strIngredient1
        });
    }

    config.bottles = bottles;
    return config;
}

module.exports = {
    setConfig,
    getConfig
};
