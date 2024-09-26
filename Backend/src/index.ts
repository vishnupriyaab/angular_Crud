import express, { Request, Response } from "express";
import { userRoute } from "./routes/userRoute";
import { adminRoute } from "./routes/adminRoute";
import { config } from "dotenv";
import cors from "cors";
import connectionDb from "./DB/DbConnection";
import morgan from "morgan";
config();

const app = express();
const port = process.env.PORT || 3000;
connectionDb();

app.use(express.json({limit:'100mb'}));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"))

app.use(cors({
  origin: ['http://localhost:4200']
}))
app.use('/user',userRoute);
app.use('/admin',adminRoute);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
