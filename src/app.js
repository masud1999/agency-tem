 require('dotenv').config();
const express = require('express');
const path   =  require('path');
const hbs = require('hbs');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
 const auth = require("./middlewere/auth");


require("./db/conn");
const Register = require("./models/mens");
const port = process.env.PORT || 8400;


const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set('view engine' , "hbs");
app.set("views",templates_path);
hbs.registerPartials(partials_path);
 


  console.log(process.env.SECRET_KEY);



app.get("/",  (req, res) => { res.render('index')});
app.get("/about",  (req, res) => {  res.render('about')});
app.get("/service",  (req, res) => { res.render('service')});
app.get("/registration",  (req, res) => {  res.render('registration')});
app.get("/login",  (req, res) => {res.render('login')});


   app.get("/secret", auth, (req, res) => {
    // console.log(`this is cookie awesome ${req.cookies.jwt}`);
     res.render('secret');
    });
            
    
               // ================> This is logout parth ===================

    app.get("/logout", auth, async (req, res) => {
          try{
            console.log(req.user);

              req.user.tokens = req.user.tokens.filter((currElement) => {
                return currElement.token !== req.token
              });

            res.clearCookie("jwt")
            console.log("logout successfully");

            await req.user.save();
            res.render("login");

          }catch(error){
            res.status(500).send(error);
          }
    })



       //========================> create a new user in our database  ========================>
       //========================> //===============================> //=============================>

app.post("/registration", async (req, res) => {
    try{
      const password = req.body.password;
      const cpassword = req.body.confirmpassword;
      if(password === cpassword){
        const employeeSchema = new Register({
          firstname:req.body.firstname,
          lastname:req.body.lastname,
          email:req.body.email,
          gender:req.body.gender,
          phone:req.body.phone,
          password:req.body.password,
          confirmpassword:req.body.confirmpassword
        });

              // this is token parth
// console.log("the success parth" + employeeSchema );

const token = await employeeSchema.generateAuthToken();
// console.log("the token parth" + token);

  //  The res.cookie() function is used to set the cookie name to value
  //  The value parameter may be a String or object converted to JSON

          res.cookie("jwt",token,{
            expires:new Date(Date.now() +50000),
            httpOnly:true
          });
        // console.log(cookie);


        const registered = await  employeeSchema.save();
          res.status(201).render("index");
      }else{
        res.send('password are not match');
      }
    }catch(error){
      res.status(400).send(error);
    }
});


           //========================> create a new user in our database  ==========================> //
           //========================> //===============================> //========================>

app.post("/login", async  (req, res) => {
     try{
      const email = req.body.email;
      const password = req.body.password;
      const useremail = await Register.findOne({email:email});

      // user password same the collaction password same the new password render (index)
                                 // login form  check
      const isMatch = await bcrypt.compare(password,useremail.password);

      const token = await useremail.generateAuthToken();
      console.log("the token parth" + token);

                //================> This is cookise parth ================================>
                res.cookie("jwt",token,{
                  expires:new Date(Date.now() +50000),
                  httpOnly:true,
                  // secure:true
                });
              

      if(isMatch){
        res.status(201).render("index");
      }else{
        res.send('password are not match');
      }
     }catch(error){
        res.status(400).send('invalid Email');
     }
});


app.listen(port,() =>{
    console.log(`the server has been the start ${port}`)
});