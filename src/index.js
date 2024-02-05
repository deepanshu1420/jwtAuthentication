require("dotenv").config();
require("./db/conn");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const router = require("./routers/router");
const cookieParser = require("cookie-parser");
const app = express();


// middleware for getting json data 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : false}));


const staticPath = path.join(__dirname,"../public");
const dynamicPath = path.join(__dirname , "../templates/views");
const partialsPath = path.join(__dirname , "../templates/partials");


app.use(express.static(staticPath));
app.set("view engine" , "hbs");
app.set("views" , dynamicPath);


hbs.registerPartials(partialsPath);

app.use(router);


const startServer = ()=>{
    const port = process.env.PORT;
    app.listen(port , ()=>{
        console.log(`server is active at ${port}`);
    })
};

startServer();