const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
  try {
    // const token = req.headers["authorization"].split(" ")[1];
    // const token = req.headers["authorization"]
    // console.log(req.headers)

    const authorizationHeader = req.headers["authorization"]

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Invalid authorization header format",
        success: false,
      })
    }

    const token = authorizationHeader.split(" ")[1]
    console.log(token, "token")

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Auth failed",
          success: false,
        })
      } else {
        req.body.userId = decoded.id
        next()
      }
    })
  } catch (error) {
    return res.status(401).send({
      message: "Auth failed",
      success: false,
    })
  }
}

