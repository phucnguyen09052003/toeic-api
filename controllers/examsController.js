const sql = require('mssql');

exports.getExamsByLevel = async (req, res) => {
    const { level } = req.params; // Lấy partID từ URL
    try {
        const pool = await sql.connect(); // Kết nối tới SQL Server
        const result = await pool.request()
            .input('level', sql.VarChar, level) // Truyền tham số vào truy vấn
            .query("select * from Exams where Level= @level"); // Xây dựng câu truy vấn
        res.json(result.recordset); // Trả về kết quả dưới dạng JSON
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Đã xảy ra lỗi khi truy vấn danh sách Exams.");
    }
};

// Lấy thông tin exam theo ExamID
exports.getExamById = async (req, res) => {
    const { examId } = req.params;

    // Kiểm tra nếu ExamID không hợp lệ
    if (!examId) {
        return res.status(400).json({ error: 'Thiếu tham số ExamID.' });
    }

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('ExamID', sql.VarChar, examId)  // ExamID là chuỗi (varchar)
            .query('SELECT * FROM Exams WHERE ExamID = @ExamID');  // Truy vấn lấy thông tin exam theo ExamID

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy exam với ExamID này.' });
        }

        res.json(result.recordset[0]); // Trả về thông tin exam
    } catch (err) {
        console.error('Error fetching exam:', err);
        res.status(500).send(err.message);
    }
};

exports.getAllExams = async (req, res) => {
    try {
        const pool = await sql.connect(); // Kết nối tới SQL Server
        const result = await pool.request()
            .query("SELECT * FROM Exams"); // Xây dựng câu truy vấn
        res.json(result.recordset); // Trả về kết quả dưới dạng JSON
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Đã xảy ra lỗi khi truy vấn danh sách Exams.");
    }
};

exports.createExam = async (req, res) => {
    const { examId, examName, description, durationInMinutes } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('examId', sql.VarChar(100), examId)
            .input('examName', sql.NVarChar(100), examName)
            .input('description', sql.NVarChar(sql.MAX), description || null)
            .input('durationInMinutes', sql.Int, durationInMinutes || null)
            .query(`
                INSERT INTO Exams (ExamID, ExamName, Description, DurationInMinutes)
                VALUES (@examId, @examName, @description, @durationInMinutes)
            `);

        res.status(201).json({ message: 'Exam created successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addQuestionToExam = async (req, res) => {
    const { examId, questionId } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('examId', sql.VarChar(100), examId)
            .input('questionId', sql.Int, questionId)
            .query(`
                INSERT INTO ExamDetail (ExamID, QuestionID)
                VALUES (@examId, @questionId)
            `);

        res.status(201).json({ message: 'Question added to exam successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getExamDetails = async (req, res) => {
    const { examId } = req.params;

    try {
        const pool = await sql.connect();
        const examResult = await pool.request()
            .input('examId', sql.VarChar(100), examId)
            .query(`SELECT * FROM Exams WHERE ExamID = @examId`);

        const questionsResult = await pool.request()
            .input('examId', sql.VarChar(100), examId)
            .query(`
                SELECT q.* 
                FROM Questions q
                INNER JOIN ExamDetail ed ON q.QuestionID = ed.QuestionID
                WHERE ed.ExamID = @examId
            `);

        if (examResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.json({
            exam: examResult.recordset[0],
            questions: questionsResult.recordset,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteExam = async (req, res) => {
    const { examId } = req.params;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('examId', sql.VarChar(100), examId)
            .query(`
                DELETE FROM Exams WHERE ExamID = @examId
            `);

        res.status(200).json({ message: 'Exam deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addQuestionToExam = async (req, res) => {
    const { examId, questionId } = req.body;
    console.log('Received examId:', examId, 'questionId:', questionId); // Log nhận được dữ liệu từ client

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('examId', sql.VarChar(100), examId)
            .input('questionId', sql.Int, questionId)
            .query(`
                INSERT INTO ExamDetail (ExamID, QuestionID)
                VALUES (@examId, @questionId)
            `);

        console.log('Insert result:', result);  // Log kết quả truy vấn
        res.status(201).json({ message: 'Question added to exam successfully!' });
    } catch (err) {
        console.error('Database error:', err.message);  // Log chi tiết lỗi nếu có
        res.status(500).json({ error: err.message });
    }
};


exports.getResultByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query('SELECT * FROM ExamResults WHERE UserID = @UserID');
      if (result.recordset.length === 0) {
        return res.status(404).send('Không tìm thấy kết quả thi');
      }
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi khi lấy kết quả thi của người dùng');
    }
  };
  
  // Thêm kết quả thi mới
  exports.createExamResult = async (req, res) => {
    const { userId, examId, score } = req.body;
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .input('ExamID', sql.VarChar, examId)
        .input('Score', sql.Int, score)
        .query(`
          INSERT INTO ExamResults (UserID, ExamID, Score)
          VALUES (@UserID, @ExamID, @Score)
          SELECT SCOPE_IDENTITY() AS ResultID
        `);
      res.status(201).json({ resultID: result.recordset[0].ResultID });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi khi thêm kết quả thi');
    }
  };
  
  // Cập nhật kết quả thi
  exports.updateExamResult = async (req, res) => {
    const resultId = req.params.resultId;
    const { score } = req.body;
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('ResultID', sql.Int, resultId)
        .input('Score', sql.Int, score)
        .query('UPDATE ExamResults SET Score = @Score WHERE ResultID = @ResultID');
      if (result.rowsAffected[0] === 0) {
        return res.status(404).send('Không tìm thấy kết quả thi để cập nhật');
      }
      res.status(200).send('Cập nhật kết quả thi thành công');
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi khi cập nhật kết quả thi');
    }
  };
  
