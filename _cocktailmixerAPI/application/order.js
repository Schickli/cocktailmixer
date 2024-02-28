async function orderCocktail(db, idDrink, glassSize) {
    const cocktail = await db.get('SELECT * FROM cocktails WHERE idDrink = ?', idDrink);

    if (cocktail === undefined) {
        throw new Error('Cocktail not found');
    }

    await createOrderTable(db);
    await db.run('INSERT INTO orders (idDrink, glassSize) VALUES (?, ?)', idDrink, glassSize);
    let id = await db.get('SELECT id FROM orders ORDER BY id DESC LIMIT 1');
    
    return id;
}

async function createOrderTable(db) {
    await db.run('CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, idDrink INTEGER, glassSize INTEGER, status TEXT DEFAULT "Pending")');
}

async function getOrders(db) {
    return await db.all('SELECT * FROM orders');
}

async function getOrderById(db, id) {
    let order = await db.get('SELECT * FROM orders WHERE id = ?', id);
    if (order === undefined) {
        throw new Error('Order not found');
    }

    return order;
}

module.exports = { orderCocktail, getOrders, getOrderById };
