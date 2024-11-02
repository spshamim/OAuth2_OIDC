const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors({ // Middleware to enable CORS
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/pro", protectedRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
