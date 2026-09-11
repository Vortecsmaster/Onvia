export type SqlParams = (string | number | null)[];

export interface SqlDatabase {
  execAsync(source: string): Promise<void>;
  runAsync(
    source: string,
    params?: SqlParams,
  ): Promise<{ changes: number; lastInsertRowId: number }>;
  getAllAsync<T>(source: string, params?: SqlParams): Promise<T[]>;
  getFirstAsync<T>(source: string, params?: SqlParams): Promise<T | null>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
}

export async function openAppDatabase(): Promise<SqlDatabase> {
  const SQLite = await import("expo-sqlite");
  const { appConfig } = await import("../../config/app");
  const db = await SQLite.openDatabaseAsync(appConfig.sqliteFile);
  return {
    execAsync: (source) => db.execAsync(source),
    runAsync: (source, params = []) => db.runAsync(source, params),
    getAllAsync: (source, params = []) => db.getAllAsync(source, params),
    getFirstAsync: (source, params = []) => db.getFirstAsync(source, params),
    withTransactionAsync: (task) => db.withTransactionAsync(task),
  };
}
