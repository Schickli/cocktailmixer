import { openDb } from "../db";
import {
  ConfigRequest,
  ConfigResponse,
  DetailBottle,
} from "../../../lib/config";

export async function getConfig() {
  let db = await openDb();
  const sql_select = `SELECT * FROM config ORDER BY id DESC LIMIT 1`;

  const row = await db.get(sql_select, []);
  const config: ConfigResponse = { bottles: [] };

  for (let i = 1; i <= 6; i++) {
    const bottle: DetailBottle = {
      position: "Bottle " + i,
      idIngrediant: row["bottle" + i] || 0,
      name: "",
    };

    if (row["bottle" + i] !== null && row["bottle" + i] !== 0) {
      const sql_select_ingredient = `SELECT strIngredient1 FROM ingredients WHERE id = ?`;
      const row2 = await db.get(sql_select_ingredient, [row["bottle" + i]]);
      bottle.name = row2.strIngredient1 || "";
    }

    config.bottles.push(bottle);
  }

  db.close();
  return config;
}

export async function setConfig(config: ConfigRequest) {
  await insertConfig(config);
  await deleteConfigWhenOverTen();
}

export async function insertConfig(config: ConfigRequest): Promise<void> {
  const db = await openDb();

  if (
    config.bottle1 == undefined ||
    config.bottle2 == undefined ||
    config.bottle3 == undefined ||
    config.bottle4 == undefined ||
    config.bottle5 == undefined ||
    config.bottle6 == undefined
  ) {
    throw new Error("Config is empty or undefined");
  }

  const sql_insert = `INSERT INTO config (bottle1, bottle2, bottle3, bottle4, bottle5, bottle6) VALUES (?, ?, ?, ?, ?, ?)`;

  await db.run(sql_insert, [
    config.bottle1,
    config.bottle2,
    config.bottle3,
    config.bottle4,
    config.bottle5,
    config.bottle6,
  ]);

  console.log("Successful insertion of the config");
  db.close();
}

async function deleteConfigWhenOverTen() {
  let db = await openDb();
  const sql_select = `SELECT COUNT(*) FROM config`;

  const count = await db.get(sql_select, []);

  if (count["COUNT(*)"] > 10) {
    const sql_delete = `DELETE FROM config WHERE id NOT IN (SELECT id FROM config ORDER BY id DESC LIMIT 10)`;

    await db.run(sql_delete, []);
    console.log(
      "Successful deletion of the configurations except the latest 10"
    );
  }

  db.close();
}
