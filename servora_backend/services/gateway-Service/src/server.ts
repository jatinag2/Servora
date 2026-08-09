import dotenv from "dotenv"
dotenv.config()
import express ,{Request,Response,NextFunction}from  "express"
import proxy from "express-http-proxy"
import {loginValidation} from "./middleware/auth.middleware"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}
))

app.use((req:Request, res:Response, next:NextFunction) => {
  console.log("Gateway:", req.method, req.originalUrl);
  next();
});

const authProxy=proxy('http://localhost:3001',{
  proxyReqPathResolver:(req)=>{
    return req.originalUrl.replace('/api/v1/auth','');
  },
  proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
    if(srcReq.user){
       proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        'user_id': JSON.stringify(srcReq.user),
      };
    }
    return proxyReqOpts;
  },

  proxyErrorHandler:(err:any,res:Response,next:NextFunction)=>{
    console.log("proxy error" , err.message);
    res.status(500).json({
      success:false,
      message:"user service unavaliable"
    })
    
  }
})

const userProxy=proxy('http://localhost:3003',{
  proxyReqPathResolver:(req)=>{
    return req.originalUrl.replace('/api/v1/user','');
  },
  proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
    if(srcReq.user){
       proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        'user_id': JSON.stringify(srcReq.user),
      };
    }
    return proxyReqOpts;
  },

  proxyErrorHandler:(err:any,res:Response,next:NextFunction)=>{
    console.log("proxy error" , err.message);
    res.status(500).json({
      success:false,
      message:"user service unavaliable"
    })
    
  }
})

//protected routes
app.use('/api/v1/auth/update-password',authProxy)
app.use("/api/v1/user",loginValidation,userProxy)
//public route

app.use('/api/v1/auth',authProxy)

const port= process.env.PORT || 3000

app.listen(port,()=>{
  console.log("gateway service running on port ",port)
})