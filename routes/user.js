const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

router.post("/register", async (req, res) => {
	try {
		const { username, email, name, surname, password } = req.body;
		const hash = await bcrypt.hash(password, 10);
		const user = new User({
			username,
			email,
			name,
			surname,
			password: hash,
		});
		const createdUser = await user.save();
		const token = createAuthToken(createdUser._id);
		res.status(201).json({
			message: "User registered",
			//token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: error,
		});
	}
});

router.post("/login", bruteforce.prevent, async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			throw new Error("Unable to log in with these credentials");
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error("Unable to log in with these credentials");
		}
		const token = createAuthToken(user._id);
		res.status(201).json({
			message: "logged in",
			token,
		});
	} catch (error) {
		res.status(500).json({
			message: "Unable to log in",
		});
	}
});

function createAuthToken(userID) {
	const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
		expiresIn: "1 day",
	});
	return token;
}

module.exports = router;
