import Database from "better-sqlite3";
import path from "path";

export function getDatabase() {
  const dbPath = path.join(process.cwd(), "ordering.db");
  return new Database(dbPath);
}

export default getDatabase;
