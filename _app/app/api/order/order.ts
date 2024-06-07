import { openDb } from "../db";

export async function orderCocktail(idDrink: number, glassSize: number) {
  const db = await openDb();
  const cocktail = await db.get(
    "SELECT * FROM cocktails WHERE idDrink = ?",
    idDrink
  );

  if (cocktail === undefined) {
    throw new Error("Cocktail not found");
  }

  await createOrderTable();
  await db.run(
    "INSERT INTO orders (idDrink, glassSize) VALUES (?, ?)",
    idDrink,
    glassSize
  );
  let id = await db.get("SELECT id FROM orders ORDER BY id DESC LIMIT 1");

  return id;
}

async function createOrderTable() {
  const db = await openDb();
  await db.run(
    'CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, idDrink INTEGER, glassSize INTEGER, status TEXT DEFAULT "Pending")'
  );
  db.close();
}

export async function getOrders() {
  const db = await openDb();
  return await db.all("SELECT * FROM orders").then(() => db.close());
}

export async function getOrderById(id: number) {
  const db = await openDb();
  let order = await db.get("SELECT * FROM orders WHERE id = ?", id);
  db.close();
  if (order === undefined) {
    throw new Error("Order not found");
  }

  return order;
}
