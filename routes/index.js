import express from "express";
import userRouter from "./user.js";
const app = express();

app.use("/api/v1/user", userRouter);

const router = express.Router();

// router.get("/balance", f);

export default router;
