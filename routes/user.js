const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try{
        const {email, password, confirmPassword} = req.body;
        // validation
        if (!(email || password || confirmPassword)){
            return res.status(400).json({errorMessage: "Please fill out all the fields."})
        }
        if (password.length < 6) {
            return res.status(400).json({errorMessage: "Please enter a password of at least 6 characters"})
        }
        if (password !== confirmPassword){
            return res.status(400).json({errorMessage: "Passwords do not match."})
        }

        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({errorMessage: "User already exists."})
        }

        //create user
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hash
        })
        const savedUser = await newUser.save();

        //log the user in once account is created
        const token = jwt.sign({user: savedUser._id}, process.env.JWT_SECRET, {expiresIn: "30m"});
        // res.send(`Logged In! Token: ${token}`)
        res.cookie("token", token, {
            httpOnly: true
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
    
})

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        //validation
        if (!(email || password)){
            return res.status(400).json({errorMessage: "Please fill out all the fields."})
        }

        const existingUser = await User.findOne({email});
        if (!existingUser){
            return res.status(401).json({errorMessage: "Wrong email or password"})
        }
        
        const passwordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!passwordCorrect){
            return res.status(400).json({errorMessage: "Incorrect password."})
        }
        const token = jwt.sign({user: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "30m"});
        res.cookie("token", token, {
            httpOnly: true
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send();
})

//since the cookies are http only, must send a get request to the server to check if the user is logged in with the token.

router.get("/loggedin", (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.send(true)
        } catch (err){
        console.error(err);
        res.json(false);
    }
})



module.exports = router;

