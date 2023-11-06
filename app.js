const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const authMW = require("./middleware/auth");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

require("dotenv").config();
app.use(cors({ origin: "http://localhost:4200", optionsSuccessStatus: 200 }));
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

const cert = fs.readFileSync("keys/Certificate.pem");
const options = {
	server: { sslCA: cert },
};

const connstring = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`;
mongoose
	.connect(connstring)
	.then(() => {
		console.log("connected");
	})
	.catch(() => {
		console.log("not connected");
	}, options);
app.use((req, res, next) => {
	res.set({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
		"Content-Type": "application/json",
		"Access-Control-Allow-Headers":
			"Origin, X-Requested-Width, Content-Type,Accept,Authorization",
		"Content-Security-Policy": "script-src 'self'",
	});
	next();
});

app.use("/api/posts", authMW, postRoutes);
app.use("/api/users", userRoutes);
module.exports = app;
