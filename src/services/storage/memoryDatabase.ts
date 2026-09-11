import type { SqlDatabase, SqlParams } from "./database";

type Row = Record<string, string | number | null>;

function keyOf(sql: string) {
  return sql.replace(/\s+/g, " ").trim();
}

export function createMemoryDatabase(): SqlDatabase {
  const tables: Record<string, Row[]> = {
    meta: [],
    profile: [],
    conditions: [],
    medications: [],
    history: [],
    places: [],
  };

  function all(name: string) {
    return tables[name] ?? [];
  }

  return {
    async execAsync() {
      return;
    },
    async runAsync(source, params: SqlParams = []) {
      const sql = keyOf(source);
      if (sql.startsWith("DELETE FROM")) {
        const table = sql.slice("DELETE FROM ".length).split(" ")[0];
        tables[table] = [];
        return { changes: 1, lastInsertRowId: 0 };
      }
      if (sql.startsWith("INSERT OR REPLACE INTO meta")) {
        const [key, value] = params as [string, string];
        tables.meta = all("meta").filter((r) => r.key !== key);
        tables.meta.push({ key, value });
        return { changes: 1, lastInsertRowId: 0 };
      }
      if (sql.startsWith("INSERT INTO profile")) {
        tables.profile = [
          {
            id: 1,
            name: params[0] as string,
            age: params[1] as number,
            sex: params[2] as string,
          },
        ];
        return { changes: 1, lastInsertRowId: 1 };
      }
      if (sql.startsWith("INSERT INTO conditions")) {
        all("conditions").push({
          id: params[0] as string,
          name: params[1] as string,
          diagnosis_date: params[2] as string,
          sort_order: params[3] as number,
        });
        return { changes: 1, lastInsertRowId: 0 };
      }
      if (sql.startsWith("INSERT INTO medications")) {
        all("medications").push({
          id: params[0] as string,
          name: params[1] as string,
          prescription_date: params[2] as string,
          lifelong: params[3] as number,
          start_date: params[4],
          end_date: params[5],
          sort_order: params[6] as number,
        });
        return { changes: 1, lastInsertRowId: 0 };
      }
      if (sql.startsWith("INSERT INTO history")) {
        all("history").push({
          id: params[0] as string,
          title: params[1] as string,
          created_date: params[2] as string,
          detail: params[3] as string,
          sort_order: params[4] as number,
        });
        return { changes: 1, lastInsertRowId: 0 };
      }
      if (sql.startsWith("INSERT INTO places")) {
        all("places").push({
          id: params[0] as string,
          name: params[1] as string,
          type: params[2] as string,
          latitude: params[3] as number,
          longitude: params[4] as number,
          source: params[5] as string,
        });
        return { changes: 1, lastInsertRowId: 0 };
      }
      return { changes: 0, lastInsertRowId: 0 };
    },
    async getAllAsync<T>(source: string) {
      const sql = keyOf(source);
      if (sql.includes("FROM meta")) return all("meta") as T[];
      if (sql.includes("FROM conditions")) return all("conditions") as T[];
      if (sql.includes("FROM medications")) return all("medications") as T[];
      if (sql.includes("FROM history")) return all("history") as T[];
      if (sql.includes("FROM places")) return all("places") as T[];
      return [];
    },
    async getFirstAsync<T>(source: string, params: SqlParams = []) {
      const sql = keyOf(source);
      if (sql.includes("COUNT(*)")) {
        return { n: all("places").length } as T;
      }
      if (sql.includes("FROM meta WHERE key")) {
        return (
          (all("meta").find((r) => r.key === params[0]) as T | undefined) ??
          null
        );
      }
      if (sql.includes("FROM profile")) {
        return (all("profile")[0] as T | undefined) ?? null;
      }
      return null;
    },
    async withTransactionAsync(task) {
      await task();
    },
  };
}
