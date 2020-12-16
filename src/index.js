var express = require("express");
var router = express.Router();

// rendering index.js (log in/sign up view)
router.get("/", function (req, res, next) {
  // retreiving the posts from the var
  var post_list = req.app.get("poststore");

  res.render("index", {
    title: "What A Day!",
    post_list: post_list
  });
});

router.post("/getin", function (req, res, next) {
  res.redirect("/signup");
});

module.exports = router;
