import express, { Application } from "express"
import authRouter from "./router/auth.routes"
import {errorHandler} from "./middleware/error.middleware"
const app: Application=express()

app.use(express.json())

app.use((req, res, next) => {
    console.log("Auth received:", req.method, req.originalUrl);
    next();
});
app.use("/",authRouter)
app.use(errorHandler)


export default app;
