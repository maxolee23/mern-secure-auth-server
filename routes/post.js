const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    try {
        const {title} = req.body;

        const newPost = new Post({
            title
        });

        const savedPost = await newPost.save();

        res.json(savedPost);

    } catch (err){
        console.error(err);
        res.status(500).send();
    }
})

router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})



module.exports = router;