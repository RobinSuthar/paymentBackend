import express from "express";
import userSchema from "../types/type.js";
import { User, Transactions } from "../db.js";
import jwt from "jsonwebtoken";
import JwtPass from "../config.js";
import authMiddleware from "../middleware.js";
const router = express.Router();

router.post("/signup", async function (req, res) {
  console.log("sadas", req.body);
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

    const userrId = newUser._id;

    Transactions.create({
      userId: userrId,
      balance: 1 + Math.random() * 10000,
    });

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

router.get("/", (req, res) => {
  res.json({
    msg: "Wokring",
  });
});

router.post("/signin", async function (req, res) {
  const { username, password } = req.body;
  console.log(username, password);
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

  const result = await User.updateOne({ id: req.userId }, UpdatedUser);

  res.json({
    msg: "Updated Successfully",
  });
});

router.get("/bulk", async function (req, res) {
  console.log("Asas");
  const queryParam = req.query.filter || "";
  console.log(queryParam);
  console.log(req.body);
  try {
    const result = await User.find({
      $or: [
        { firstName: { $regex: queryParam } },
        { lastName: { $regex: queryParam } },
      ],
    });

    res.json({
      user: result.map((user) => ({
        username: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (err) {
    res.json({
      msg: "Error In FInding User from Database",
    });
  }
});

export default router;
