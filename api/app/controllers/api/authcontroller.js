const {success,error,validation}= require("../../helpers/responseApi");
const {randsomstring}=require("../../helpers/common");
const {validationResult}=require("express-validator");
const bcrypt =require("bcryptjs");
const config = require("config");
const jwt =require("jsonwebtoken");
const User =require("../../models/user")
const Verification =require("../../models/verification");
const crypto =require("crypto");
const console = require("console");


const key =  Buffer.from('writesomethingof32lettersinthisb');
    var iv=  Buffer.from("abcdefghijklmnop")

function decrypt(text) {
  iv = Buffer.from(iv, 'hex');
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString()
  }

 
  exports.login =async (req,res) => {

console.time("login")

console.time("decrypt")
let som = decrypt(req.body.encryptedData)
console.timeEnd("decrypt")
som= JSON.parse(som)
const email=som.email;
const password= som.password
const macaddress = som.macaddress

try{
console.time("find user")
  const user=await User.findOne({email: email.toLowerCase()});
  console.timeEnd("find user")
  if(!user)
  return res.status(422).json(validation("invalid email"));
  console.time("password check")
  let checkpassword =await bcrypt.compare(password,user.password);
  console.timeEnd("password check")
  const createlog= async function(userid,address){
    return User.findByIdAndUpdate(
        userid,
        {
            $push:{
                loginfo :{
                timing: Date.now(),
                macaddress:address
                }
            }
        },
        { new: true, useFindAndModify: false }
    );
    
};
  if(checkpassword)
    {
      if(user.loggedin&&user.macaddress==macaddress)
      {
          
         


         const payload = {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        };
    
        jwt.sign(
          payload,
          "somejwthiddentext",
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            console.time("log")
    
            createlog(user._id,user.macaddress);
            console.timeEnd("log")
            
            res
              .status(200)
              .json(success("Login success Bitches!!", { token }, res.statusCode));
              console.timeEnd("login")
              
              console.log("is it done")
          }
        );
        
          
      }
      else if(!user.loggedin&&user.macaddress=="imthereforyou"){
          user.macaddress=macaddress;
          user.loggedin=true;
          user.save();
         
          const payload = {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          };
      
          jwt.sign(
            payload,
            "somejwthiddentext",
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
      
              createlog(user._id,user.macaddress);
              res
                .status(200)
                .json(success("Login success Bitches!!", { token }, res.statusCode));
               
            }
          );
      }
    else{
      return res.status(404).json(error("password is wrong", res.statusCode));
    }
    
    }
      else{
        

        return res.status(404).json(error("password is wrong", res.statusCode));
      }
  
  

}

catch (err) {

 return res.status(500).json(error("Server error", res.statusCode));
}

  };
