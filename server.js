const express = require("express")
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./swaggerConfig")

const app = express()
require("dotenv").config()
const dbConfig = require("./config/dbConfig")
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const categoryRoute = require("./routes/categoryRoute")
const productRoute = require("./routes/productRoute")
const cartRoute = require("./routes/cartRoute")
const orderRoute = require("./routes/orderRoute.js")
const userRoute = require("./routes/userRoutes.js")

app.use("/api/user", userRoute)
app.use("/api/category", categoryRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

const port = process.env.PORT || 5000

app.get("/", (req, res) => res.send("Hello World!"))
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`))

