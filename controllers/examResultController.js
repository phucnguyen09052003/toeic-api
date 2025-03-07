const sql = require('mssql');


exports.getResultsByUser = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, pageSize = 5 } = req.query;  // Mặc định trang 1 và mỗi trang 5 kết quả

    const offset = (page - 1) * pageSize;  // Tính toán OFFSET dựa trên trang và số kết quả mỗi trang

    try {
        const pool = await sql.connect();
        
        // Truy vấn lấy kết quả thi theo phân trang
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Offset', sql.Int, offset)
            .input('PageSize', sql.Int, pageSize)
            .query(`
                SELECT 
                    ResultID, 
                    UserID, 
                    ExamID, 
                    Score, 
                    FORMAT(CompletedAt, 'dd/MM/yyyy') AS CompletedDate
                FROM ExamResults 
                WHERE UserID = @UserID
                ORDER BY CompletedAt DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
            `);

        // Truy vấn tổng số kết quả thi của người dùng
        const totalResultsQuery = await pool.request()
            .input('UserID', sql.Int, userId)
            .query(`
                SELECT COUNT(*) AS TotalResults
                FROM ExamResults
                WHERE UserID = @UserID
            `);

        const totalResults = totalResultsQuery.recordset[0].TotalResults;
        const totalPages = Math.ceil(totalResults / pageSize);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy kết quả thi cho người dùng này.' });
        }

        res.status(200).json({
            results: result.recordset,
            pagination: {
                currentPage: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages,
                totalResults
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi khi lấy kết quả thi của người dùng.');
    }
};



// Thêm kết quả thi mới hoặc cập nhật nếu đã tồn tại
exports.createOrUpdateExamResult = async (req, res) => {
    const { userId, examId, score } = req.body;
    try {
        const pool = await sql.connect();

        // Kiểm tra xem kết quả thi đã tồn tại chưa
        const existingResult = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('ExamID', sql.VarChar, examId)
            .query('SELECT * FROM ExamResults WHERE UserID = @UserID AND ExamID = @ExamID');

        if (existingResult.recordset.length > 0) {
            // Nếu kết quả đã tồn tại, thực hiện cập nhật
            const result = await pool.request()
                .input('UserID', sql.Int, userId)
                .input('ExamID', sql.VarChar, examId)
                .input('Score', sql.Int, score)
                .query(`
                    UPDATE ExamResults 
                    SET Score = @Score, CompletedAt = GETDATE() 
                    WHERE UserID = @UserID AND ExamID = @ExamID
                `);

            return res.status(200).json({ message: 'Cập nhật kết quả thi thành công.' });
        } else {
            // Nếu kết quả chưa tồn tại, thực hiện tạo mới
            const result = await pool.request()
                .input('UserID', sql.Int, userId)
                .input('ExamID', sql.VarChar, examId)
                .input('Score', sql.Int, score)
                .query(`
                    INSERT INTO ExamResults (UserID, ExamID, Score) 
                    VALUES (@UserID, @ExamID, @Score)
                    SELECT SCOPE_IDENTITY() AS ResultID
                `);

            return res.status(201).json({ message: 'Thêm kết quả thi thành công.', resultId: result.recordset[0].ResultID });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi khi thêm hoặc cập nhật kết quả thi.');
    }
};

// Cập nhật điểm thi theo ResultID
exports.updateExamResult = async (req, res) => {
    const { resultId } = req.params;
    const { score } = req.body;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('ResultID', sql.Int, resultId)
            .input('Score', sql.Int, score)
            .query('UPDATE ExamResults SET Score = @Score WHERE ResultID = @ResultID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy kết quả thi để cập nhật.' });
        }
        res.status(200).json({ message: 'Cập nhật kết quả thi thành công.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi khi cập nhật kết quả thi.');
    }
};
