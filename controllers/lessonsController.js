const sql = require('mssql');


// API để lấy tất cả các bài học
exports.getLesson = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Lessons');
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu lessons:', err.message); // Log lỗi
        res.status(500).send(err.message);
    }
};

// API để thêm bài học
exports.addLesson = async (req, res) => {
    const { Title, Content, QuestionType, Guide, Score, PartID } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Title', sql.VarChar, Title)
            .input('Content', sql.Text, Content)
            .input('QuestionType', sql.VarChar, QuestionType)
            .input('Guide', sql.Text, Guide)
            .input('Score', sql.VarChar, Score) // Thêm trường Score
            .input('PartID', sql.Int, PartID) // Đảm bảo kiểu dữ liệu khớp
            .query(`
                INSERT INTO Lessons (Title, Content, QuestionType, Guide, Score, PartID)
                OUTPUT INSERTED.LessonID AS LessonID
                VALUES (@Title, @Content, @QuestionType, @Guide, @Score, @PartID)
            `);

        // Kiểm tra xem có kết quả không
        if (result.rowsAffected[0] > 0) {
            const lessonId = result.recordset[0].LessonID; // Lấy ID của bài học mới
            res.status(201).json({ message: 'Bài học đã được thêm thành công!', LessonID: lessonId });
        } else {
            res.status(500).json({ error: 'Có lỗi xảy ra khi thêm bài học.' });
        }
    } catch (err) {
        console.error('Lỗi khi thêm bài học:', err.message);
        res.status(500).json({ error: 'Lỗi khi thêm bài học: ' + err.message });
    }
};

// API để sửa bài học
exports.updateLesson = async (req, res) => {
    const { id } = req.params;
    const { Title, Content, QuestionType, Guide, Score, PartID } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Title', sql.VarChar, Title)
            .input('Content', sql.Text, Content)
            .input('QuestionType', sql.VarChar, QuestionType)
            .input('Guide', sql.Text, Guide)
            .input('Score', sql.VarChar, Score) // Thêm trường Score
            .input('PartID', sql.Int, PartID) // Đảm bảo kiểu dữ liệu khớp với cơ sở dữ liệu
            .input('LessonID', sql.Int, id) // Sử dụng kiểu Int nếu LessonID là số
            .query('UPDATE Lessons SET Title = @Title, Content = @Content, QuestionType = @QuestionType, Guide = @Guide, Score = @Score, PartID = @PartID WHERE LessonID = @LessonID');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Bài học đã được cập nhật thành công!' });
        } else {
            res.status(404).json({ message: 'Bài học không tìm thấy!' });
        }
    } catch (err) {
        console.error('Lỗi khi sửa bài học:', err.message);
        res.status(500).json({ error: 'Lỗi khi sửa bài học: ' + err.message });
    }
};

// API để xóa bài học
exports.deleteLesson = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('LessonID', sql.VarChar, id) // Thay đổi kiểu dữ liệu nếu cần thiết
            .query('DELETE FROM Lessons WHERE LessonID = @LessonID');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Bài học đã được xóa thành công!' });
        } else {
            res.status(404).json({ message: 'Bài học không tìm thấy!' });
        }
    } catch (err) {
        console.error('Lỗi khi xóa bài học:', err.message);
        res.status(500).json({ error: 'Lỗi khi xóa bài học: ' + err.message });
    }
};
