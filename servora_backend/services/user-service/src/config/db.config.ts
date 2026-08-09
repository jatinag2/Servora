import mongoose from "mongoose"

const DBconnect=async()=>{
    try {
        const mongoDBURL=process.env.MONGOO_DB_URI
        if(!mongoDBURL){
            console.log('mongoDB URL not found')
            process.exit(1)
        }
        const connect=await mongoose.connect(mongoDBURL)
        console.log("monogo db connected successfully");
    } catch (error) {
        if(error instanceof Error){
            console.error("faliure in connecting monodb connection",error.message)
        }
        else console.error("faliure in connecting monodb connection with some unknown error",error)
        process.exit(1)
    }
}

export default DBconnect;