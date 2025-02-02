import express from "express";
import User from "./db";
import mainRouter from "./routes/index.js";
const app = express();

const router = express.Router();

//ALl request coming here goes there
app.use("/api/v1", router);

router.get("/SomePage", function (req, res) {
  res.json({
    msg: "Working",
  });
});

router.listen(3001, () => {
  console.log("BackEnd Server is Up and Running");
});
