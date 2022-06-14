const express = require("express");
const app = express();

const connectToMongoDB = require("./config/db");
//var port = process.env.PORT || 6000

// Accept incoming request
app.use(express.json({ extended: false }));

// Connect to MongoDB
connectToMongoDB();
// Run the server
app.get("/", (req, res) => {
    res.send("Hello World!");
})
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/petBuy",require("./routes/api/petBuy"))

// remove below line to make it deployable

app.listen(3000, () => console.log(`Server started on port 3000,`))


//module.exports = app;
