const { hash } = require('bcrypt');
const { create } = require('hbs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const employeeSchema = new mongoose.Schema({
    firstname:{   type:String,  require:true,  unique:true,  trim:true },
    lastname:{  type:String,  require:true,  trim:true },
    email:{  type:String,  require:true,  trim:true},
    gender:{  type:String,require:true },
    phone:{   type:Number,  require:true },
    password:{  type:String,  require:true },
    confirmpassword:{  type:String,  require:true },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})

                 //======================> Generate tokens ==============================>
                //======================> ===============> =============================>

         employeeSchema.methods.generateAuthToken = async function(){
             try{
                 console.log(this._id);
               const token = jwt.sign({_id:this._id.toString()} , process.env.SECRET_KEY);
                       // key value both are SVGMaskElement, esliya token likha
               this.tokens = this.tokens.concat({token:token});
            //    console.log(token);
               await this.save();
               return token;
             }catch(error){
              res.send("the error parth" + error);
              console.log("the error part" + error);
             }
         }

             // =======================> employee password hash =============================>

    employeeSchema.pre("save", async function(next){
        if(this.isModified("password")){
            console.log(`The current password is ${this.password}`);
            this.password = await bcrypt.hash(this.password,10);
            console.log(`The current password is ${this.password}`);
            // this.confirmpassword = undefined;
             this.confirmpassword = await bcrypt.hash(this.password,10);
        }
           next();
    })



              // now we need to create a Collection
const Register = new mongoose.model("Register",employeeSchema);
module.exports =  Register ;