const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");



const app = express();
const {PORT, MONGO_CONNECT} = process.env;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(morgan("dev"));

mongoose.connect(MONGO_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) return console.log(err);
    console.log("Connected to MongoDB")
});


app.use("/auth", require("./routes/user"));
app.use("/posts", require("./routes/post"));
