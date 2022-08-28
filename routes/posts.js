const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create a Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.delete();
      res.status(200).json("Deleted Successfully");
    } else {
      res.status(401).json("UnAuthorized");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id);
      const post = await updatedPost.save({
        $set: req.body,
      });

      res.status(200).json(post);
    } else {
      res.status(401).json("UnAuthorized");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Liked");

      // post.likes.push(req.body.userId);
    } else {
      await Post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("UnLiked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Timeline Posts (Concating two arrays) using PROMISE
router.get("/posts/timeline", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const posts = await Post.find({ userId: req.body.userId });
    const friendPosts = await Promise.all(
      user.followings.map((item) => {
        return Post.find({ userId: item });
      })
    );
    res.status(500).json(posts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
