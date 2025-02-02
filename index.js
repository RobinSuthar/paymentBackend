import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import bodyParser from "body-parser";
const app = express();

//ALl request coming here goes there
app.use(cors());

app.use(bodyParser.json());

app.use("/api/v1", mainRouter);

app.listen(3001, () => {
  console.log("Backend Server Is Up and Running");
});
