const mongoose = require('mongoose')
const express = require('express')
const app = express()
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = express.Router()
require('dotenv').config()
const port = process.env.PORT || 3000
const accounts = require("./models/account");
const status = require("./models/statusUpdate");

const mongoURI = 'mongodb+srv://arisbakri:091079@learnmongodb.haeaon1.mongodb.net/fblite'

// connect MongoDB server
mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connection Established')
})
.catch((error) => {
    console.error(error)
})

// decode POST Data
app.use(express.urlencoded({extended:true}))

//Create session object
app.use(
    session({
      secret: process.env.MY_SECRET,
      resave: false,
      cookie: { maxAge: 5 * 60 * 1000 },
      saveUninitialized: false,
    })
  );

//Load home page
// app.get("/", (req, res) => {
//     accounts.find().then((success)=>{
//         res.render("index.ejs", { currentUser: req.session.currentUser,status:success })

//     })
//   });

app.get("/", (req, res) => {
    status.find().then((success) => {
      const currentUser = req.session.currentUser || null;
      res.render("index.ejs", { currentUser: currentUser, status: success });
    });
  });


app.get("/", (req, res) => {
    accounts.find().then((success) => {
      const currentUser = req.session.currentUser || null;
      res.render("index.ejs", { currentUser: currentUser, status: success });
    });
  });  

  

//Redirect routes starting with login to login controller
const loginController = require("./controller/login_controller")
app.use("/login", loginController)

//Redirect routes starting with signup to signup controller
const signupController = require("./controller/signup_controller")
app.use("/signup", signupController)

const statusController = require("./controller/status_controller")
app.use("/status", statusController)

// Port server
app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
