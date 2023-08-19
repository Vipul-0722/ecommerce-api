const mongoose = require("mongoose")

// Set the strictQuery option to false to address the deprecation warning
mongoose.set("strictQuery", false)

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection is successful")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
  })

const connection = mongoose.connection

connection.on("error", (error) => {
  console.log("Error in MongoDB connection", error.message)
})

module.exports = mongoose

