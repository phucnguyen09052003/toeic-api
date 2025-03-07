const sql = require('mssql');

exports.getAllVocabulary = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Vocabulary');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createWord = async (req, res) => {
    const { Word, Translation, TopicID, Image } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Word', sql.VarChar, Word)
            .input('Translation', sql.NVarChar, Translation)
            .input('TopicID', sql.VarChar, TopicID)
            .input('Image', sql.VarChar, Image)
            .query(`
                INSERT INTO Vocabulary (Word, Translation, TopicID, Image) 
                VALUES (@Word, @Translation, @TopicID, @Image)
            `);

        res.status(201).send(`Từ đã được thêm với ID: ${result.rowsAffected}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateWord = async (req, res) => {
    const { Word, Translation, TopicID, Image } = req.body;
    const id = req.params.id;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Word', sql.VarChar, Word)
            .input('Translation', sql.NVarChar, Translation)
            .input('TopicID', sql.NVarChar, TopicID)
            .input('Image', sql.NVarChar, Image)
            .input('ID', sql.Int, id)
            .query(`
                UPDATE Vocabulary 
                SET Word = @Word, Translation = @Translation, TopicID = @TopicID, Image = @Image 
                WHERE WordID = @ID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Không tìm thấy từ để sửa.');
        }

        res.send('Từ đã được sửa thành công.');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteWord = async (req, res) => {
    const id = req.params.id; // Lấy ID từ tham số URL

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('ID', sql.Int, id) // Giả định ID là kiểu Int
            .query(`
        DELETE FROM Vocabulary 
        WHERE WordID = @ID
    `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Không tìm thấy từ để xóa.');
        }

        res.send('Từ đã được xóa thành công.');
    } catch (err) {
        res.status(500).send(err.message);
    }
};




exports.getWordById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Vocabulary WHERE WordID = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getVocabularyByTopic = async (req, res) => {
    const { topicId } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('TopicID', sql.Int, topicId)
            .query('SELECT * FROM Vocabulary WHERE TopicID = @TopicID');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
