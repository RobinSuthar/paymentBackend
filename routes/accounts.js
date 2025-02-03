import express from "express";
import authMiddleware from "../middleware.js";
import { Transactions } from "../db.js";
const router = express.Router();

router.get("/balance", authMiddleware, async function (req, res) {
  const result = await Transactions.findOne({
    userId: req.userId,
  });
  res.json({
    msg: result.balance,
  });
});

router.post("/transfer", authMiddleware, async function (req, res) {
  const userId = req.userId;
  const { accountTo, amount } = req.body;

  const session = Transactions.startSession();

  (await session).startTransaction();
  const AccountTo = await Transactions.findOne({
    userId: req.userId,
  });

  if (!AccountTo.userId) {
    (await session).abortTransaction();
    res.json({
      msg: "There is no Account, Please Check Again",
    });

    return;
  }

  const AccountFrom = await Transactions.findOne({
    userId: req.userId,
  });

  if (AccountFrom.balance < amount) {
    res.status(400).json({
      msg: "Insufficient Funds",
    });

    return;
  }

  try {
    AccountTo.updateOne({
      $inc: { balance: -amount },
    });

    AccountFrom.updateOne({
      $inc: { balance: amount },
    });
    res.json({
      msg: "Money Transfered Successfully",
    });

    (await session).commitTransaction();
    return;
  } catch (err) {
    res.json({
      msg: err,
    });
  }
});

export default router;
