const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// update user
router.put("/:id", async (req, res) => {
  if (req.params.id === req.body.userId) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({ msg: "User Update Success", updatedUser });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Unauthorized");
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  if (req.params.id === req.body.userId) {
    try {
      const posts = await Post.deleteMany({ userId: req.body.userId });
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Delete Successful");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only Delete your account!");
  }
});

// Get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// FOLLOW & UNFOLLOW a user (Make Changes to an array (following & followers))
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.userId);
      const followedUser = await User.findById(req.params.id);
      if (!followedUser.followers.includes(req.body.userId)) {
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        await followedUser.updateOne({ $push: { followers: req.body.userId } });
        res.status(200).json("follow successfull");
      } else {
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        await followedUser.updateOne({ $pull: { followers: req.body.userId } });
        res.status(403).json("unfollowed successfull");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

module.exports = router;
