import express from "express";
import userSchema from "../types/type.js";
import User from "../db.js";
import jwt from "jsonwebtoken";
import JwtPass from "../config.js";
const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    msg: "Hello",
  });
});

router.post("/signup", async function (req, res) {
  const user = req.body;
  console.log(user);
  const result = userSchema.safeParse(user);
  console.log(result);
  if (!result.success) {
    return res.json({
      msg: "Incorrect Input Validation",
    });
  }
  const { firstName, lastName, userName, passWord } = req.body;
  console.log(userName);
  try {
    const query = await User.findOne({ userName: userName });

    if (query) {
      return res.json({
        msg: "User Name Already Exist's into Database.",
      });
    }

    const newUser = new User({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      password: passWord,
    });

    await newUser.save();

    var token = jwt.sign(
      {
        userId: newUser._id,
      },
      JwtPass
    );
    console.log(token);
    res.json({
      msg: "User Created Successfully ",
      token: token,
    });
  } catch (err) {
    res.json({
      msg: err,
    });
  }
});

export default router;
