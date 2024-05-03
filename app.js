const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session")
const userRouter = require("./router/userRouter");
const bookRouter = require("./router/bookRouter");

const app = express();

app.use(express.static("./public"))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'votre_secret_key', 
    resave: true, 
    saveUninitialized: true, 
}));
app.use(userRouter)
app.use(bookRouter)


app.listen(3000 ,()=>{
    console.log("ecoute sur le port 3000");
});


mongoose.connect('mongodb://127.0.0.1:27017/booki');

