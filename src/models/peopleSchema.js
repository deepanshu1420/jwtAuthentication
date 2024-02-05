const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const peopleSchema = new mongoose.Schema({
    name : {
        type : String,
        // required : true,
        trim : true,
        minlength : 3
    },
    email :{
        type : String,
        required : true,
        unique : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid Email received ....");
            }
        }
    },
    phone : {
        type : Number,
        required : true,
        unique : true,
        validate(val){
            if(!validator.isMobilePhone((val+""))){
                throw new Error("Invalid Phone Number received ....");
            }
        }
    },
    date : {
        type : Date,
        default : Date.now
    },
    password : {
        type : String,
        required : true,
        minlength : 3
    },
    cpassword : {
        type : String,
        minlength : 3
    },
    tokens : [
        {
            token : {
                type : String,
                required: true
            }
        }
    ]

});

peopleSchema.methods.generateToken = async function(next){
    try{
        
        const token = jwt.sign({_id : this._id} , process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        // next();
        return token;
    }catch(e){
        console.log(e);
    }
}
peopleSchema.pre("save" , async function(){
    try{
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password , 10);
            this.cpassword = undefined;
        }
    }catch(e){
        console.log(e);
    }
})
const People = new mongoose.model("People" , peopleSchema);

module.exports = People;
