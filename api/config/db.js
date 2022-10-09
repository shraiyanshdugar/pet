const mongoose = require("mongoose");

// Make connection to MongoDB
const connectToMongoDB = async () => {
  try {
    const uri = "mongodb+srv://Tagged:Tagged123@cluster0.wezqpjm.mongodb.net/Tagged?retryWrites=true&w=majority";
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      useFindAndModify: true,
    }).then(console.log("connected")).catch((err)=>console.log(err));

    
  } catch (err) {
    console.error("is this error");
    // Terminate the application
    process.exit(1);
  }
};


module.exports = connectToMongoDB;
