const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = 5001;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

const userModel = require("./model/user");
const userController = require("./controller/user");

const tokenHandler = require("./utils/token")

const corsOptions = {
  origin: 'http://localhost:3000',
}
app.use(cors(corsOptions))
app.use(jsonParser);
app.use(urlencodedParser);

async function getReqToken(req, res, next) {
  let json;
  const token = req.header('authorization') || false
  if (token) {
    const token = req.header('authorization')
    const user_platform_id = tokenHandler.verifyJWT(token)
    const userInfoResult = await userModel.getUserInfo({ user_platform_id })
    if (userInfoResult.rowCount > 0) {
      return next()
    } else {
      json = {
        success: false,
        err: "token invalid"
      }
      return res.status(403).json(json)
    }
  }
  json = {
    success: false,
    err: "token required"
  }
  return res.status(403).json(json)
}

app.post("/line/login", userController.lineLogin)
app.post("/line/logout", getReqToken, userController.lineLogout)
app.post("/user/userInfo", getReqToken, userController.getUserInfo)
app.post("/line/notify", getReqToken, userController.lineNotify)
app.post("/line/notify/post", getReqToken, userController.lineNotifyPost)
app.post("/line/notify/cancel", getReqToken, userController.cancelNotify)

app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});