const mongoose = require("mongoose");
async function connectDatabase(){
    try{
        const res = await mongoose.connect(`mongodb+srv://deepanshu:${process.env.DB_PASSWORD}@cluster0.vstxtwv.mongodb.net/${process.env.DATABASE_HOST}`);
        console.log("Database connection is successful ....");
    }catch(e){
        console.log(e);
    }
}
connectDatabase();
