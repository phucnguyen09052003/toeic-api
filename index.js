const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const config = require('./dbconfig');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

//singleton 
// config.getPool()
// .then(() => console.log('Kết nối thành công đến SQL Server'))
// .catch(err => console.error('Kết nối thất bại:', err));

// Kết nối CSDL
// sql.connect(config)
//     .then(() => console.log('Kết nối thành công đến SQL Server'))
//     .catch(err => console.error('Kết nối thất bại:', err));

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API TOEIC Practice",
            version: "1.0.0",
            description: "Tài liệu API cho hệ thống luyện thi TOEIC",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.js"], // Tự động quét các file trong thư mục routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import các route
const topicsRoutes = require('./routes/topic');
const vocabularyRoutes = require('./routes/vocabulary');
// const questionsRoutes = require('./routes/questions');
// const partsRoutes = require('./routes/parts');
// const examsRoutes = require('./routes/exams');
const userRoutes = require('./routes/users');
// const lessonRoutes = require('./routes/lessons');
// const examResult = require('./routes/examResult');

// Sử dụng các route
app.use('/api/topic', topicsRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
// app.use('/api/questions', questionsRoutes);
// app.use('/api/parts', partsRoutes);
// app.use('/api/exams', examsRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/results', examResult);

// Khởi động server
app.listen(port, async() => {
   


    // console.log(`Server đang chạy tại http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
