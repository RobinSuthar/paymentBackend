import express from "express";
import authMiddleware from "../middleware.js";
import { Transactions } from "../db.js";
import mongoose from "mongoose";
const router = express.Router();

router.get("/balance", authMiddleware, async function (req, res) {
  const result = await Transactions.findOne({
    userId: req.userId,
  });
  console.log(result);
  res.json({
    msg: result.balance,
  });
});

router.post("/transfer", authMiddleware, async function (req, res) {
  console.log("Here");
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;
  console.log(amount, to);
  const account = await Transactions.findOne({
    userId: req.userId,
  }).session(session);

  if (account.balance < amount) {
    await session.abortTransaction();
    return res.json({
      msg: "Insuccificient Funds",
    });
  }

  const toAccount = await Transactions.findOne({
    userId: to,
  }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.json({
      msg: "Invalid Acoount",
    });
  }

  await Transactions.updateOne(
    {
      userId: req.userId,
    },
    { $inc: { balance: -amount } }
  ).session(session);
  await Transactions.updateOne(
    {
      userId: to,
    },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();
  res.json({
    msg: "Transfer Successfull",
  });
});

export default router;
