import { DetailIngredient } from "@/lib/ingredient";
import { openDb } from "../db";

export async function orderCocktail(
  idDrink: number,
  glassSize: number,
  ingredients: DetailIngredient[]
) {
  const db = await openDb();
  const cocktail = await db.get(
    "SELECT * FROM cocktails WHERE idDrink = ?",
    idDrink
  );

  if (cocktail === undefined) {
    throw new Error("Cocktail not found");
  }

  await createOrderTables();
  await db.run(
    "INSERT INTO orders (idDrink, glassSize) VALUES (?, ?)",
    idDrink,
    glassSize
  );

  const order = await db.get("SELECT id FROM orders ORDER BY id DESC LIMIT 1");
  const orderId = order.id;

  for (const ingredient of ingredients) {
    await db.run(
      "INSERT INTO order_ingredients (orderId, ingredient, measure) VALUES (?, ?, ?)",
      orderId,
      ingredient.ingredient,
      ingredient.measure
    );
  }

  db.close();
  return orderId;
}

async function createOrderTables() {
  const db = await openDb();
  await db.run(
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY, 
      idDrink INTEGER, 
      glassSize INTEGER, 
      status TEXT DEFAULT 'Pending'
    )`
  );
  await db.run(
    `CREATE TABLE IF NOT EXISTS order_ingredients (
      id INTEGER PRIMARY KEY,
      orderId INTEGER,
      ingredient TEXT,
      measure TEXT,
      FOREIGN KEY(orderId) REFERENCES orders(id)
    )`
  );
  db.close();
}

export async function getOrders() {
  const db = await openDb();
  const orders = await db.all("SELECT * FROM orders");
  db.close();
  return orders;
}

export async function getOrderById(id: number) {
  const db = await openDb();
  const order = await db.get("SELECT * FROM orders WHERE id = ?", id);
  if (order === undefined) {
    db.close();
    throw new Error("Order not found");
  }
  const ingredients = await db.all(
    "SELECT * FROM order_ingredients WHERE orderId = ?",
    id
  );
  db.close();

  return { ...order, ingredients };
}
