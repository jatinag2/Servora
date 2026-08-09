import express, { Application } from "express"
import userRouter from "./routes/user.routes";
import fileUpload from "express-fileupload"
import {errorHandler} from "./middleware/errorHandler"
const app: Application=express()

app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use((req, res, next) => {
  console.log('User service:', req.method, req.originalUrl);
  next();
});
app.use("/",userRouter)

app.use(errorHandler)

export default app;
