// const sql = require('mssql');
const db = require("../dbconfig");
const ITopicService = require('../interface/ITopicService');

class TopicService extends ITopicService {
    async getAllTopics() {
        try {
            const pool = await db.getPool();
            const result = await pool.request().query('SELECT * FROM Topics');
            return result.recordset;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addTopic(topic) {
        try {
            console.log("du lieu nhan duoc",topic)
            const pool = await db.getPool();
            await pool.request()
                .input('TopicID', db.sql.VarChar, topic.TopicID)
                .input('Name', db.sql.NVarChar, topic.Name)
                .query('INSERT INTO Topics (TopicID, Name) VALUES (@TopicID, @Name)');
            return `Chủ đề đã được thêm với ID: ${topic.TopicID},tên : ${topic.Name} `;
        } catch (err) {
            console.error("Lỗi:", err.message);
            throw new Error(err.message);
        }
    }

    async updateTopic(topicID, topic) {
        try {
            
            const pool = await db.getPool();
            const result = await pool.request()
                .input('TopicID', db.sql.VarChar, topicID)
                .input('Name', db.sql.NVarChar, topic.Name)
                .query('UPDATE Topics SET Name = @Name WHERE TopicID = @topicID');
            
            if (result.rowsAffected[0] === 0) {
                
                throw new Error('Topic not found');
            }

            return 'Topic updated successfully';
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteTopic(topicID) {
        try {
            console.log('du lieu nhan:',topicID)
            const pool = await db.getPool();
            const result = await pool.request()
                .input('topicID', db.sql.VarChar, topicID)
                .query('DELETE FROM Topics WHERE TopicID = @topicID');

            if (result.rowsAffected[0] === 0) {
                throw new Error('Topic not found');
            }

            return 'Topic deleted successfully';
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new TopicService();
