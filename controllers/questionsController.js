const sql = require('mssql');

// Lấy danh sách câu hỏi theo phần
exports.getRandomQuestionByPart = async (req, res) => {
    const { part, examQuestion } = req.params;  // Lấy cả part và examQuestion từ tham số URL
    try {
        const pool = await sql.connect();

        // Truy vấn câu hỏi ngẫu nhiên với PartID và ExamQuestion
        const result = await pool.request()
            .input('part', sql.Int, part)  // Nhận tham số part từ URL
            .input('examQuestion', sql.Int, examQuestion)  // Nhận tham số examQuestion từ URL
            .query('SELECT TOP 1 * FROM Questions WHERE PartID = @part AND ExamQuestion = @examQuestion ORDER BY NEWID()'); // Lấy ngẫu nhiên 1 câu hỏi

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// Lấy danh sách N câu hỏi ngẫu nhiên theo PartID, Level, ExamQuestion
exports.getRandomQuestions = async (req, res) => {
    const { part, level, examQuestion, n } = req.query;

    // Kiểm tra các tham số đầu vào
    if (!part || !level || !examQuestion || !n) {
        return res.status(400).json({ error: 'Thiếu tham số part, level, examQuestion hoặc n.' });
    }

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('PartID', sql.Int, parseInt(part))
            .input('Level', sql.Int, parseInt(level))
            .input('ExamQuestion', sql.Bit, parseInt(examQuestion)) // ExamQuestion giả định là kiểu BIT
            .input('N', sql.Int, parseInt(n)) // Số lượng câu hỏi
            .query(
                `SELECT TOP (@N) * 
                 FROM Questions 
                 WHERE PartID = @PartID AND Level = @Level AND ExamQuestion = @ExamQuestion 
                 ORDER BY NEWID()` // Lấy ngẫu nhiên
            );

        res.json(result.recordset); // Trả về danh sách câu hỏi
    } catch (err) {
        console.error('Error fetching random questions:', err);
        res.status(500).send(err.message);
    }
};

exports.getNGroupQuestionByLevelnPart = async (req, res) => {
    try {
        const { N, PartID, Level } = req.query;

        // Validate input
        if (!N || !PartID || !Level) {
            return res.status(400).json({ message: "Missing required query parameters: N, PartID, Level" });
        }

        // Query database
        const questions = await Question.find({
            PartID: PartID,
            Level: Level,
            ExamQuestion: true
        })
            .limit(parseInt(N)) // Limit by N groups
            .populate('QuestionGroupID') // Populate QuestionGroup if it's a reference
            .exec();

        return res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching questions." });
    }
};

// Lấy tất cả câu hỏi theo Part
exports.getQuestionsByPart = async (req, res) => {
    const { part } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('part', sql.Int, part)
            .query('SELECT * FROM Questions WHERE PartID = @part');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// API lấy question groups
exports.getQuestionsGroups = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .query('SELECT * FROM QuestionGroup');
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu question groups:', err.message); // Log lỗi
        res.status(500).send(err.message);
    }
};

// API lấy thông tin nhóm câu hỏi theo QuestionGroupID
exports.getQuestionGroupById = async (req, res) => {
    const { groupId } = req.params; // Lấy QuestionGroupID từ tham số URL

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('QuestionGroupID', sql.VarChar, groupId) // Truyền tham số vào câu truy vấn
            .query('SELECT * FROM QuestionGroup WHERE QuestionGroupID = @QuestionGroupID');

        // Kiểm tra nếu không tìm thấy dữ liệu
        if (result.recordset.length === 0) {
            return res.status(404).send('Nhóm câu hỏi không tìm thấy.');
        }

        res.json(result.recordset[0]); // Trả về thông tin nhóm câu hỏi
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu nhóm câu hỏi:', err.message);
        res.status(500).send(err.message);
    }
};

// Lấy thống kê câu hỏi của người dùng
exports.getUserQuestionStats = async (req, res) => {
    const { userId } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM GetUserQuestionStats(@userId)');
        res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Lấy nhóm câu hỏi ngẫu nhiên bằng Stored Procedure
exports.getRandomGroupByStoredProc = async (req, res) => {
    const partId = parseInt(req.params.partId);

    if (isNaN(partId)) {
        return res.status(400).json({ error: 'Invalid PartID' });
    }

    try {
        const pool = await sql.connect();
        const request = pool.request();
        request.input('PartID', sql.Int, partId);

        // Gọi stored procedure
        const result = await request.execute('GetRandomQuestionsByPart');

        res.json(result.recordset); // Trả về danh sách câu hỏi
    } catch (err) {
        console.error('Error executing stored procedure:', err);
        res.status(500).send('Internal Server Error');
    }
};
exports.getRandomQuestionsByPartAndLevel = async (req, res) => {
    const n = parseInt(req.query.n);
    const part = parseInt(req.query.part);
    const level = parseInt(req.query.level);

    // Kiểm tra xem các tham số có hợp lệ không
    if (isNaN(n) || isNaN(part) || isNaN(level)) {
        return res.status(400).json({ error: 'Invalid parameters: n, part, or level must be numbers' });
    }

    try {
        // Kết nối tới SQL Server
        const pool = await sql.connect();
        const request = pool.request();

        // Truyền tham số vào stored procedure
        request.input('N', sql.Int, n);
        request.input('PartID', sql.Int, part);
        request.input('Level', sql.Int, level);

        // Gọi stored procedure
        const result = await request.execute('GetRandomQuestionsByPartAndLevel');

        // Trả về kết quả câu hỏi
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error executing stored procedure:', err);
        res.status(500).send('Internal Server Error');
    }
};


exports.getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Questions WHERE QuestionID = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.getGroupQuestionById = async (req, res) => {
    const { questionId } = req.params;  // Sử dụng questionId thay vì id
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('questionId', sql.VarChar, questionId)
            .query('SELECT * FROM QuestionGroup WHERE QuestionGroupID = @questionId');

        console.log(result.recordset);  // Log kết quả để kiểm tra

        if (result.recordset.length === 0) {
            // Trường hợp không tìm thấy QuestionGroup
            return res.status(404).json({ message: "QuestionGroup not found" });
        }

        // Trả về dữ liệu nếu tìm thấy
        res.json(result.recordset[0]);
    } catch (err) {
        // Xử lý lỗi máy chủ
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};



exports.getPaginatedQuestionGroups = async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query; // Mặc định page = 1, limit = 10
    try {
        const pool = await sql.connect();
        const offset = (page - 1) * pageSize;

        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, parseInt(pageSize))
            .query(`
                SELECT * 
                FROM QuestionGroup
                ORDER BY QuestionGroupID
                OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

                SELECT COUNT(*) AS total
                FROM QuestionGroup;
            `);

        const questionGroups = result.recordsets[0];
        const total = result.recordsets[1][0].total;

        res.json({
            data: questionGroups,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.createQuestionGroup = async (req, res) => {
    const { questionGroupId, audio, content } = req.body;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('questionGroupId', sql.VarChar, questionGroupId)
            .input('audio', sql.VarChar, audio)
            .input('content', sql.NVarChar, content)
            .query(`
                INSERT INTO QuestionGroup (QuestionGroupID, Audio, Content)
                VALUES (@questionGroupId, @audio, @content)
            `);
        res.status(201).send('Question Group created successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.updateQuestionGroup = async (req, res) => {
    const { id } = req.params;
    const { audio, content } = req.body;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('audio', sql.VarChar, audio)
            .input('content', sql.NVarChar, content)
            .query(`
                UPDATE QuestionGroup
                SET Audio = @audio, Content = @content
                WHERE QuestionGroupID = @id
            `);
        res.send('Question Group updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Delete a Question Group
exports.deleteQuestionGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.VarChar, id)
            .query(`
                DELETE FROM QuestionGroup WHERE QuestionGroupID = @id
            `);
        res.send('Question Group deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.getQuestions = async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query; // Phân trang
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('offset', sql.Int, (page - 1) * pageSize)
            .input('pageSize', sql.Int, parseInt(pageSize))
            .query(`
                SELECT * 
                FROM Questions
                ORDER BY QuestionID
                OFFSET @offset ROWS 
                FETCH NEXT @pageSize ROWS ONLY;
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createQuestion = async (req, res) => {
    const { questionGroupId, partId, level, questionAudio, questionText, questionImage, answerA, answerB, answerC, answerD, correctAnswer, explanation, examQuestion } = req.body;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('questionGroupId', sql.VarChar, questionGroupId)
            .input('partId', sql.Int, partId)
            .input('level', sql.Int, level)
            .input('questionAudio', sql.NVarChar, questionAudio)
            .input('questionText', sql.NVarChar, questionText)
            .input('questionImage', sql.NVarChar, questionImage)
            .input('answerA', sql.NVarChar, answerA)
            .input('answerB', sql.NVarChar, answerB)
            .input('answerC', sql.NVarChar, answerC)
            .input('answerD', sql.NVarChar, answerD)
            .input('correctAnswer', sql.Char, correctAnswer)
            .input('explanation', sql.NVarChar, explanation)
            .input('examQuestion', sql.Bit, examQuestion)
            .query(`
                INSERT INTO Questions (QuestionGroupID, PartID, Level, QuestionAudio, QuestionText, QuestionImage, AnswerA, AnswerB, AnswerC, AnswerD, CorrectAnswer, Explanation, ExamQuestion)
                VALUES (@questionGroupId, @partId, @level, @questionAudio, @questionText, @questionImage, @answerA, @answerB, @answerC, @answerD, @correctAnswer, @explanation, @examQuestion)
            `);
        res.status(201).send('Question created successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { questionGroupId, partId, level, questionAudio, questionText, questionImage, answerA, answerB, answerC, answerD, correctAnswer, explanation, examQuestion } = req.body;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .input('questionGroupId', sql.VarChar, questionGroupId)
            .input('partId', sql.Int, partId)
            .input('level', sql.Int, level)
            .input('questionAudio', sql.NVarChar, questionAudio)
            .input('questionText', sql.NVarChar, questionText)
            .input('questionImage', sql.NVarChar, questionImage)
            .input('answerA', sql.NVarChar, answerA)
            .input('answerB', sql.NVarChar, answerB)
            .input('answerC', sql.NVarChar, answerC)
            .input('answerD', sql.NVarChar, answerD)
            .input('correctAnswer', sql.Char, correctAnswer)
            .input('explanation', sql.NVarChar, explanation)
            .input('examQuestion', sql.Bit, examQuestion)
            .query(`
                UPDATE Questions 
                SET QuestionGroupID = @questionGroupId, PartID = @partId, Level = @level, QuestionAudio = @questionAudio,
                    QuestionText = @questionText, QuestionImage = @questionImage, AnswerA = @answerA, AnswerB = @answerB, 
                    AnswerC = @answerC, AnswerD = @answerD, CorrectAnswer = @correctAnswer, Explanation = @explanation, ExamQuestion = @examQuestion
                WHERE QuestionID = @id
            `);
        res.send('Question updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Questions WHERE QuestionID = @id');
        res.send('Question deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};


exports.getQuestionsByExamId = async (req, res) => {
    const { examId } = req.params; // Lấy ExamID từ URL

    try {
        // Kết nối cơ sở dữ liệu
        const pool = await sql.connect();

        // Thực hiện truy vấn
        const result = await pool.request()
            .input('ExamID', sql.VarChar, examId) // Truyền tham số ExamID
            .query(`
              SELECT 
                    q.QuestionID,
                    q.QuestionGroupID,
                    q.PartID,
                    q.Level,
                    q.QuestionAudio,
                    q.QuestionText,
                    q.QuestionImage,
                    q.AnswerA,
                    q.AnswerB,
                    q.AnswerC,
                    q.AnswerD,
                    q.CorrectAnswer,
                    q.Explanation,
                    q.ExamQuestion,
                    g.Content AS GroupContent,
                    g.Audio AS GroupAudio
                FROM ExamDetail ed
                JOIN Questions q ON ed.QuestionID = q.QuestionID
                LEFT JOIN QuestionGroup g ON q.QuestionGroupID = g.QuestionGroupID
                WHERE ed.ExamID = @ExamID
                ORDER BY q.PartID, q.QuestionGroupID, q.QuestionID;
            `);

        // Kiểm tra nếu không có câu hỏi nào
        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy câu hỏi nào cho ExamID: ${examId}`,
            });
        }
        const formattedData = formatQuestions(result.recordset);
        res.status(200).json(
            formattedData,
        );
    } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching questions by ExamID:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy câu hỏi.',
        });
    }
};
const formatQuestions = (questions) => {
    const groupedQuestions = {};

    questions.forEach((q) => {
        if (q.PartID === 5 || q.PartID === 1 | q.PartID === 2 || q.PartID === 3) {
            // Câu hỏi đơn lẻ
            groupedQuestions[q.QuestionID] = {
                type: 'single',
                content: q.QuestionText,
                answers: [q.AnswerA, q.AnswerB, q.AnswerC, q.AnswerD],
                correctAnswer: q.CorrectAnswer,
                explanation: q.Explanation,
                image: q.QuestionImage,
                audio: q.QuestionAudio,
            };
        } else if ([6, 7, 4].includes(q.PartID)) {
            // Nhóm câu hỏi
            if (!groupedQuestions[q.QuestionGroupID]) {
                groupedQuestions[q.QuestionGroupID] = {
                    type: 'group',
                    groupContent: q.GroupContent,
                    groupAudio: q.GroupAudio,
                    questions: [],
                };
            }
            groupedQuestions[q.QuestionGroupID].questions.push({
                questionID: q.QuestionID,
                questionText: q.QuestionText,
                answers: [q.AnswerA, q.AnswerB, q.AnswerC, q.AnswerD],
                correctAnswer: q.CorrectAnswer,
                explanation: q.Explanation,
                image: q.QuestionImage,
                audio: q.QuestionAudio,
            });
        }
    });

    return Object.values(groupedQuestions);
};

// Controller để lấy danh sách câu hỏi theo ExamID
exports.getExamQuestions = async (req, res) => {
    const examID = req.params

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('ExamID', sql.VarChar(100), examID)
            .query(`
                SELECT 
                    q.QuestionID,
                    q.QuestionGroupID,
                    q.PartID,
                    q.Level,
                    q.QuestionAudio,
                    q.QuestionText,
                    q.QuestionImage,
                    q.AnswerA,
                    q.AnswerB,
                    q.AnswerC,
                    q.AnswerD,
                    q.CorrectAnswer,
                    q.Explanation,
                    q.ExamQuestion,
                    g.Content AS GroupContent,
                    g.Audio AS GroupAudio
                FROM ExamDetail ed
                JOIN Questions q ON ed.QuestionID = q.QuestionID
                LEFT JOIN QuestionGroup g ON q.QuestionGroupID = g.QuestionGroupID
                WHERE ed.ExamID = @ExamID
                ORDER BY q.PartID, q.QuestionGroupID, q.QuestionID;
            `);

        const formattedData = formatQuestions(result.recordset);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err });
    }
};


exports.getExamQuestions = async (req, res) => {
    const examID = req.params

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('ExamID', sql.VarChar(100), examID)
            .query(`
                SELECT 
                    q.QuestionID,
                    q.QuestionGroupID,
                    q.PartID,
                    q.Level,
                    q.QuestionAudio,
                    q.QuestionText,
                    q.QuestionImage,
                    q.AnswerA,
                    q.AnswerB,
                    q.AnswerC,
                    q.AnswerD,
                    q.CorrectAnswer,
                    q.Explanation,
                    q.ExamQuestion,
                    g.Content AS GroupContent,
                    g.Audio AS GroupAudio
                FROM ExamDetail ed
                JOIN Questions q ON ed.QuestionID = q.QuestionID
                LEFT JOIN QuestionGroup g ON q.QuestionGroupID = g.QuestionGroupID
                WHERE ed.ExamID = @ExamID
                ORDER BY q.PartID, q.QuestionGroupID, q.QuestionID;
            `);

        const formattedData = formatQuestions(result.recordset);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err });
    }
};


