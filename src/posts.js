// Author: Roosa Hynninen
// Web applications final project

// required libraries
var express = require("express");
var router = express.Router();
var log_user;

// good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// getting listing of posts
router.get("/", function (req, res, next) {
  // retreiving posts from global var
  var data = req.app.get("poststore");

  // sending array of objects to browser
  res.render("posts", {
    post_list: data
  });
});

// sanitation middleware
// https://express-validator.github.io/docs/sanitization-chain-api.html
// https://express-validator.github.io/docs/filter-api.html
router.post("/create", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  var local_content = req.body.content;
  var local_author = req.body.author;
  var date = new Date();
  var hour = date.getHours() + 3;
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var day = date.getDate();
  var mon = date.getMonth() + 1;
  var a = date.getFullYear();
  var check = req.body.checkbox;

  var h = String(hour);

  if (h === "24") {
    hour = "00";
  }
  if (h === "25") {
    hour = "01";
  }
  var m = String(min);

  if (m.length === 1) {
    min = "0" + m;
  }

  var s = String(sec);

  if (s.length === 1) {
    sec = "0" + s;
  }

  var time = hour + ":" + min;
  var date1 = day + "." + mon + "." + a;

  if (check === "YES") {
    local_author = log_user;
  }

  console.log("We got content: " + local_content);
  console.log("from author: " + local_author);
  console.log("Time: " + time, date1);

  if (local_content.length <= 400) {
    if (local_content && local_author !== "") {
      req.app.get("poststore").unshift({
        author: local_author,
        content: local_content,
        time: time,
        date: date1
      });
      console.log("post added!");

      res.redirect("/posts");
    }
  } else {
    console.log("error");
  }
});

router.post("/logout", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  res.redirect("/");
});

router.post("/login", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  var users = req.app.get("userstore");
  var local_user = req.body.loginuser;
  var local_password = req.body.loginpassword;
  var found = 0;

  for (var i = 0; i < users.length; i++) {
    console.log(users[i].user);
    if (users[i].user === local_user) {
      if (users[i].pass === local_password) {
        log_user = users[i].user;
        found++;
      }
    }
  }

  if (found === 0) {
    console.log("Username or password is incorrect.");
    res.redirect("/");
  } else {
    res.redirect("/posts");
    console.log(local_user + " logged in");
  }
});

router.post("/signup", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  var local_user = req.body.signupuser;
  var local_password = req.body.signuppassword;

  if (local_user && local_password !== "") {
    console.log("New user: " + local_user + " signed up.");
    req.app.get("userstore").push({
      user: local_user,
      pass: local_password
    });
    res.redirect("/");
  } else {
    console.log("Not all the fields were filled.");
    res.redirect("/signup");
  }
});

module.exports = router;
