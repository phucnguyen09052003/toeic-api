const sql = require('mssql');

// Lấy tất cả Parts
exports.getAllParts = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Parts');
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách Part:', err);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
};

// Thêm Part
exports.addPart = async (req, res) => {
    const { Title, MediaURL } = req.body;
    try {
        const pool = await sql.connect();

        // Lấy PartID lớn nhất hiện có
        const result = await pool.request()
            .query('SELECT ISNULL(MAX(PartID), 0) AS MaxPartID FROM Parts');

        const newPartID = result.recordset[0].MaxPartID + 1; // Tăng giá trị lớn nhất lên 1

        // Thêm phần mới vào bảng
        await pool.request()
            .input('PartID', sql.Int, newPartID)
            .input('Title', sql.NVarChar, Title)
            .input('MediaURL', sql.NVarChar, MediaURL)
            .query('INSERT INTO Parts (PartID, Title, MediaURL) VALUES (@PartID, @Title, @MediaURL)');

        // Trả về thông báo thành công
        res.send('Thêm phần thành công');
    } catch (err) {
        console.error('Lỗi khi thêm Part:', err);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
};

// Cập nhật Part
exports.updatePart = async (req, res) => {
    const { PartID, Title, MediaURL } = req.body;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('PartID', sql.Int, PartID)
            .input('Title', sql.NVarChar, Title)
            .input('MediaURL', sql.NVarChar, MediaURL)
            .query('UPDATE Parts SET Title = @Title, MediaURL = @MediaURL WHERE PartID = @PartID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Không tìm thấy phần');
        }

        res.send('Cập nhật phần thành công');
    } catch (err) {
        console.error('Lỗi khi cập nhật Part:', err);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
};

// Xóa Part
exports.deletePart = async (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số URL
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('PartID', sql.Int, id)
            .query('DELETE FROM Parts WHERE PartID = @PartID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Không tìm thấy phần');
        }

        res.send('Xóa phần thành công');
    } catch (err) {
        console.error('Lỗi khi xóa Part:', err);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
};