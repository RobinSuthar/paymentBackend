import express from "express";
import userSchema from "../types/type.js";
import User from "../db.js";
import jwt from "jsonwebtoken";
import JwtPass from "../config.js";
import authMiddleware from "../middleware.js";
const router = express.Router();

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
  const { firstName, lastName, userName, password } = req.body;
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
      password: password,
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

router.post("/signin", async function (req, res) {
  const { username, password } = req.body;

  try {
    const query = await User.findOne({ userName: username });
    console.log(query);
    if (!query) {
      return res.json({
        msg: "No Username/Password Found",
      });
    }

    if (query.password == password) {
      return res.json({
        msg: "Logged in Successfully",
      });
    }

    return res.json({
      msg: "Incorrect Password",
    });
  } catch (err) {
    res.json({
      msg: err,
    });
  }
});

router.put("/", authMiddleware, async function (req, res) {
  const UpdatedUser = req.body;

  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: decoded.userId },
      UpdatedUser
    );

    if (!pdatedUser) {
      return res.json({ msg: "User Did not Updated" });
    }

    res.json({ msg: "User Updated Successfully" });
  } catch (err) {
    res.json({
      msg: err,
    });
  }
});

router.put("/bulk", authMiddleware, async function (req, res) {
  const queryParam = req.query.filter;
  try {
    const result = User.find({
      $or: [{ firstName: queryParam }, { lastName: queryParam }],
    });

    if (!result) {
      res.json({
        msg: "There is not User under That Name",
      });
    }

    res.json({
      result,
    });
  } catch (err) {
    res.json({
      msg: "Error In FInding User from Database",
    });
  }
});

export default router;
