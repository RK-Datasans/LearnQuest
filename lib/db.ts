import mysql, { Pool, PoolOptions } from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: Pool | undefined;
}

export function getDbPool(): Pool {
  if (!globalThis._mysqlPool) {
    const config: PoolOptions = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'learnquest',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };

    globalThis._mysqlPool = mysql.createPool(config);
  }
  return globalThis._mysqlPool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error, 'SQL:', sql);
    throw error;
  }
}

export async function execute(sql: string, params: any[] = []): Promise<any> {
  try {
    const pool = getDbPool();
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', error, 'SQL:', sql);
    throw error;
  }
}

export default {
  getDbPool,
  query,
  execute,
};
