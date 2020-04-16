const express = require("express");
const db = require("../data/db");

const router = express.Router();

//GET request to /api/posts
router.get("/", (req, res) => {
    console.log(req.query)
    db.find(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})

//GET request to /api/posts/:id
router.get("/:id", (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            console.log("post", post)
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ 
                error: "The post information could not be retrieved."
            })
        })
})

//GET request to /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
        .then(post => {
            console.log("post", post)
            if (post.length) {
                res.status(201).json(post)
            } else {
                return res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ 
                error: "The comments information could not be retrieved."
            })
        })
})



module.exports = router