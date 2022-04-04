const userModel = require("../model/user");
const tokenHandler = require("../utils/token")
const axios = require("axios")

async function getAccessToken(code) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const params = {
    grant_type: "authorization_code",
    code,
    redirect_uri: "http://localhost:3000/login/line/return",
    client_id: process.env.LINE_LOGIN_ID,
    client_secret: process.env.LINE_LOGIN_SECRET,
  }

  const searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key])
  })


  try {
    const result = await axios.post("https://api.line.me/oauth2/v2.1/token", searchParams, { headers })
    console.log("get Access Token result.data", result.data);
    return result.data
  } catch (err) {
    console.log("get Access Token result err", err);
    return false
  }
}

async function getUserInfo(acces_token) {
  // https://api.line.me/v2/profile
  const headers = {
    Authorization: `Bearer ${acces_token}`
  }


  try {
    const result = await axios.get("https://api.line.me/v2/profile", { headers })
    console.log("getUserInfo result.data", result.data);
    return result.data
  } catch (err) {
    console.log("getUserInfo result err", err);
    return false
  }
}

const userController = {
  lineLogin: async (req, res) => {
    let json;
    const { code } = req.body.data
    // access_token, token_type, refresh_token, expires_in, scope, id_token
    const { access_token } = await getAccessToken(code)

    if (!access_token) {
      json = {
        success: false,
      }
      return res.status(400).json(json)
    }

    if (access_token) {
      console.log("access_token", access_token);
      const { userId, displayName, pictureUrl } = await getUserInfo(access_token)
      const token = tokenHandler.createJWT({ user_platform_id: userId })

      const checkUserResult = await userModel.checkUser({ user_platform_id: userId })
      if (checkUserResult) {
        json = {
          success: false,
          error: "user exisest"
        }
        return res.status(400).json(json)
      }

      const createUserResult = await userModel.createLineUser({
        access_token,
        user_platform_id: userId
      })

      if (!createUserResult) {
        json = {
          success: false,
          error: createUserResult
        }
        return res.status(400).json(json)
      }

      json = {
        success: true,
        userInfo: {
          name: displayName,
          avatar: pictureUrl
        }
      }
      res.setHeader('Authorization', 'Bearer '+ token); 
      return res.status(200).json(json)
    }
  }
}

module.exports = userController