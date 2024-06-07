import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Open SQLite database connection
export async function openDb() {
  const db_name = "./data/cocktail.db";

  return open({
    filename: db_name,
    driver: sqlite3.Database,
  });
}
