import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import bodyParser from "body-parser";
const app = express();

const router = express.Router();

//ALl request coming here goes there
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", mainRouter);

// router.get("/SomePage", function (req, res) {
//   res.json({
//     msg: "Working",
//   });
// });

// router.listen(3001, () => {
//   console.log("BackEnd Server is Up and Running");
// });
