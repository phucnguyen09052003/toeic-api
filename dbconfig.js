const sql = require('mssql');
const config = {
  user: 'sa',
  password: '123',
  server: 'LAPTOP-2R4R3AEO', // 
  database: 'ToeicData',
  options: {

    trustServerCertificate: true // Nếu kết nối cục bộ, để true
  }
};

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = new sql.ConnectionPool(config);
      this.poolConnect = this.pool.connect();
      Database.instance = this;
    }
    return Database.instance;
  }

  async getPool() {
    await this.poolConnect; 
    return this.pool;
  }
}

module.exports = new Database();
module.exports.sql = sql;

