const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = 5001;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

const userController = require("./controller/user");

const corsOptions = {
  origin: 'http://localhost:3000',
}
app.use(cors(corsOptions))
app.use(jsonParser);
app.use(urlencodedParser);

function getReqToken(req, res, next) {
  let json;
  const token = req.header('authorization') || false
  if (token) {
    next()
  } else {
    json = {
      success: false,
      err: "token required"
    }
    return res.status(403).json(json)
  }
}

app.post("/login/line", userController.lineLogin)
app.post("/logout/line", getReqToken, userController.lineLogout)
app.post("/user/userInfo", getReqToken, userController.getUserInfo)

app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});