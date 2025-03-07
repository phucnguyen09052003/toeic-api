const sql = require('mssql');


// API để lấy tất cả người dùng
exports.getUser = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Users');
        console.log('Dữ liệu users:', result.recordset); // Log dữ liệu trả về
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu users:', err.message); // Log lỗi
        res.status(500).send(err.message);
    }
};

exports.createUser = async (req, res) => {
    const { username, password, fullName, email, role } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa (optional)
    try {
        const pool = await sql.connect();
        const existingUser = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username');

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Thêm người dùng mới vào cơ sở dữ liệu
        await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('PasswordHash', sql.NVarChar, password) // Nên mã hóa mật khẩu trước khi lưu trữ
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('Role', sql.Int, role) // Mặc định role là 0 nếu không được cung cấp
            .query('INSERT INTO Users (Username, PasswordHash, FullName, Email, Role) VALUES (@Username, @PasswordHash, @FullName, @Email, @Role)');

        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error('Lỗi khi thêm người dùng:', err.message); // Log lỗi
        res.status(500).send(err.message);
    }
};


// API để reset mật khẩu của người dùng
exports.resetpassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body; // Lấy mật khẩu mới từ body

    try {
        const pool = await sql.connect();
        // Thực hiện truy vấn SQL để cập nhật mật khẩu
        await pool.request()
            .input('newPassword', sql.VarChar, newPassword)
            .input('userId', sql.VarChar, userId) // Cần thay đổi kiểu dữ liệu nếu cần
            .query('UPDATE Users SET PasswordHash = @newPassword WHERE Username = @userId');

        res.status(200).send('Mật khẩu đã được reset thành công.');
    } catch (err) {
        console.error('Lỗi khi reset mật khẩu:', err.message);
        res.status(500).send(err.message);
    }
};

// API để lấy người dùng theo tên đăng nhập
exports.getUserByName = async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Trả về thông tin người dùng
        } else {
            res.status(404).json({ message: 'User not found.' }); // Không tìm thấy người dùng
        }
    } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err.message); // Log lỗi
        res.status(500).send(err.message);
    }
};

exports.updateUser = async (req, res) => {
    const { username } = req.params; // Lấy username từ params
    const { fullName, email, role } = req.body;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('username', sql.NVarChar, username) // Thay đổi input để lấy username
            .input('fullName', sql.NVarChar, fullName)
            .input('email', sql.NVarChar, email)
            .input('role', sql.Bit, role)
            .query('UPDATE Users SET FullName = @fullName, Email = @email, Role = @role WHERE Username = @username');
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteUser = async (req, res) => {
    const username = req.params.username; // Lấy username từ tham số

    try {
        const pool = await sql.connect();
        // Thực hiện truy vấn SQL để xóa người dùng
        const result = await pool.request()
            .input('username', sql.VarChar, username) // Cần thay đổi kiểu dữ liệu nếu cần
            .query('DELETE FROM Users WHERE Username = @username');

        // Kiểm tra số dòng bị ảnh hưởng
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Người dùng đã được xóa thành công!' });
        } else {
            res.status(404).json({ message: 'Người dùng không tìm thấy!' });
        }
    } catch (err) {
        console.error('Lỗi khi xóa người dùng:', err.message);
        res.status(500).json({ error: 'Lỗi khi xóa người dùng: ' + err.message });
    }
};


exports.createUserQuestion = async (req, res) => {
    const { UserID, QuestionID, Saved } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('QuestionID', sql.Int, QuestionID)
            .input('Saved', sql.Bit, Saved || 0) // Mặc định là 0 nếu không có giá trị
            .query(`
                INSERT INTO User_Question (UserID, QuestionID, Saved)
                VALUES (@UserID, @QuestionID, @Saved);
            `);

        res.status(201).json({
            message: 'User question created successfully',
            rowsAffected: result.rowsAffected
        });
    } catch (error) {
        console.error('Error creating user question:', error.message);
        res.status(500).json({ message: 'Error creating user question', error: error.message });
    }
};

// Cập nhật User_Question
exports.updateUserQuestion = async (req, res) => {
    const { id } = req.params;
    const { Saved } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .input('Saved', sql.Bit, Saved)
            .query(`
                UPDATE User_Question
                SET Saved = @Saved
                WHERE Id = @Id;
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'User question updated successfully' });
        } else {
            res.status(404).json({ message: 'User question not found' });
        }
    } catch (error) {
        console.error('Error updating user question:', error.message);
        res.status(500).json({ message: 'Error updating user question', error: error.message });
    }
};

exports.getUserQuestionsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query(`
                SELECT * 
                FROM User_Question
                WHERE UserID = @UserID;
            `);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(404).json({ message: `No user questions found for UserID: ${userId}` });
        }
    } catch (error) {
        console.error('Error fetching user questions by UserID:', error.message);
        res.status(500).json({ message: 'Error fetching user questions by UserID', error: error.message });
    }
};

exports.getSavedQuestions = async (req, res) => {
    const userId = req.params.userId; // Lấy userID từ params

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
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
                FROM User_Question uq
                JOIN Questions q ON uq.QuestionID = q.QuestionID
                LEFT JOIN QuestionGroup g ON q.QuestionGroupID = g.QuestionGroupID
                WHERE uq.UserID = @userId AND uq.Saved = 1
                ORDER BY q.PartID, q.QuestionGroupID, q.QuestionID;
            `);

        res.status(200).json(result.recordset); // Trả về danh sách câu hỏi
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message }); // Trả lỗi nếu có vấn đề
    }
};
