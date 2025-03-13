const db = require("../dbconfig");
const IVocabularyService = require("../interface/IVocabularyService");

class VocabularyService extends IVocabularyService {
    async getAllVocabulary() {
        try {
            const pool = await db.getPool();
            const result = await pool.request().query("SELECT * FROM Vocabulary");
            return result.recordset;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getWordById(id) {
        try {
            console.log("dulieu: ",id)
            const pool = await db.getPool();
            const result = await pool.request()
                .input("id", db.sql.Int, id)
                .query("SELECT * FROM Vocabulary WHERE WordID = @id");
            return result.recordset[0];
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getVocabularyByTopic(topicId) {
        try {
            const pool = await db.getPool();
            const result = await pool.request()
                .input("TopicID", db.sql.VarChar, topicId)
                .query("SELECT * FROM Vocabulary WHERE TopicID = @TopicID");
            return result.recordset;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async createWord(word) {
        try {
            const pool = await db.getPool();
            await pool.request()
                .input("Word", db.sql.VarChar, word.Word)
                .input("Translation", db.sql.NVarChar, word.Translation)
                .input("TopicID", db.sql.VarChar, word.TopicID)
                .input("Image", db.sql.VarChar, word.Image)
                .query("INSERT INTO Vocabulary (Word, Translation, TopicID, Image) VALUES (@Word, @Translation, @TopicID, @Image)");

            return `Từ đã được thêm: ${word.Word}`;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updateWord(id, word) {
        try {
            const pool = await db.getPool();
            const result = await pool.request()
                .input("ID", db.sql.Int, id)
                .input("Word", db.sql.VarChar, word.Word)
                .input("Translation", db.sql.NVarChar, word.Translation)
                .input("TopicID", db.sql.VarChar, word.TopicID)
                .input("Image", db.sql.VarChar, word.Image)
                .query("UPDATE Vocabulary SET Word = @Word, Translation = @Translation, TopicID = @TopicID, Image = @Image WHERE WordID = @ID");

            if (result.rowsAffected[0] === 0) {
                throw new Error("Không tìm thấy từ để sửa.");
            }

            return "Từ đã được sửa thành công.";
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteWord(id) {
        try {
            const pool = await db.getPool();
            const result = await pool.request()
                .input("ID", db.sql.Int, id)
                .query("DELETE FROM Vocabulary WHERE WordID = @ID");

            if (result.rowsAffected[0] === 0) {
                throw new Error("Không tìm thấy từ để xóa.");
            }

            return "Từ đã được xóa thành công.";
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new VocabularyService();
