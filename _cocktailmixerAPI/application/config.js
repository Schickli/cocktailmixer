

function setConfig(db, config) {
    createConfigTable(db);
    
}

function createConfigTable(db) {
    const sql_create = `CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bottle1 TEXT,
        bottle2 TEXT,
        bottle3 TEXT,
        bottle4 TEXT,
        bottle5 TEXT,
        bottle6 TEXT,
    )`;

    db.run(sql_create, err => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Successful creation of the 'config' table");
    });
}

module.exports = {
    setConfig
};
