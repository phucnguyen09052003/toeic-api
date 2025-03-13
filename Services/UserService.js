const db = require("../dbconfig");
const IUserService = require('../interface/IUserService');

class UserService extends IUserService{
    async getUser(){
        try {
            const pool = await db.getPool();
            const result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    async getUserByName(username) {
        try {
            console.log("Dữ liệu username:", username);
            const pool = await db.getPool();
            const result = await pool.request()
                .input('Username', db.sql.NVarChar, username)
                .query('SELECT * FROM Users WHERE Username = @Username'); 
    
            return result.recordset.length > 0 ? result.recordset[0] : null;
        } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err.message);
            throw err; 
        }
    }
    
}
module.exports = new UserService();