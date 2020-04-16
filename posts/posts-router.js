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

//POST request to /api/posts -- CREATES new post
router.post("/", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(404).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
    db.insert(req.body) 
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            })
        })
})

//POST request to /api/posts/:id/comments -- CREATE new comment
router.post("/:id/comments", (req, res) => {
    const { text } = req.body // when testing in Insomnia { "text": "comment"}
    const { id: post_id } = req.params

    if (!req.body.text) {
        return res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    }

    db.insertComment({ text, post_id })
        .then(comment => {
            console.log("comment", comment)
            if (!comment.id) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(201).json(comment)
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ 
                error: "There was an error while saving the comment to the database."
            })
        })
})

//DELETE request to /api/posts/:id
router.delete("/:id", (req, res) => {
    db.remove(req.params.id)
        .then((count) => {
            if (count > 0) {
                res.status(204).json({
                    message: "Success! Post deleted."
                })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post could not be removed."
            })
        })
})

//PUT request to /api/posts/:id  -- Update the post
router.put("/", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
    db.update(req.params.id, req.body) 
        .then(post => {
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
                error: "The post information could not be modified."
            })
        })
})

module.exports = router