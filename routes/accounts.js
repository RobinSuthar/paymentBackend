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

  const acoountFrom = await Transactions.findOne({
    userId: req.userId,
  });

  if (acoountFrom.balance < amount) {
    res.status(400).json({
      msg: "Insufficient Funds",
    });

    return;
  }

  res.json({
    msg: result.balance,
  });
});

export default router;
