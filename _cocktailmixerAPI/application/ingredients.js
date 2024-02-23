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
        return row;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getIngredients,
    getIngredientById
};