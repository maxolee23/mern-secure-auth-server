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

router.delete("/:id", auth, async (req, res) => {
    const postToBeDeleted = req.body;
    try {
        await Post.findOneAndDelete({id: postToBeDeleted._id});
        res.status(200).json({message: `post deleted`});
        // console.log(req.body._id.$oid)
    } catch (err){
        console.error(err);
        res.status(500).send();
    }
})



module.exports = router;