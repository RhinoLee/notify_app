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
    return result.data
  } catch (err) {
    console.log("get Access Token result err", err);
    return false
  }
}

async function getUserLineInfo(acces_token) {
  const headers = {
    Authorization: `Bearer ${acces_token}`
  }

  try {
    const result = await axios.get("https://api.line.me/v2/profile", { headers })
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
      return res.status(403).json(json)
    }

    if (access_token) {
      const { userId, displayName, pictureUrl } = await getUserLineInfo(access_token)
      const token = tokenHandler.createJWT({ user_platform_id: userId })

      // 確認 user 是否已存在
      const checkUserResult = await userModel.getUserInfo({ user_platform_id: userId })

      // user 已存在，更新 token
      if (checkUserResult.rowCount > 0) {
        const updateUserResult = await userModel.updateLineUserToken({ access_token, user_platform_id: userId })
        json = {
          success: true,
          userInfo: {
            name: displayName,
            avatar: pictureUrl
          }
        }
        res.setHeader("Access-Control-Expose-Headers", "Authorization")
        res.setHeader("Authorization", "Bearer " + token);
        return res.status(200).json(json)
      }

      // user 不存在，新增 user
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
      res.setHeader('Authorization', 'Bearer ' + token);
      return res.status(200).json(json)
    }
  },
  getUserInfo: async (req, res) => {
    let json;
    const token = req.header('authorization') || false
    if (token) {
      const user_platform_id = tokenHandler.verifyJWT(token)
      const result = await userModel.getUserInfo({ user_platform_id })
      if (result.rowCount > 0) {
        const access_token = result.rows[0].login_access_token
        const userInfo = await getUserInfo(access_token)
        json = {
          success: true,
          userInfo
        }

        return res.status(200).json(json)
      }

      json = {
        success: false,
        err: "user not exist"
      }
      return res.status(404).json(json)
    }

    json = {
      success: false,
      err: "token required"
    }
    return res.status(403).json(json)
  },
}

module.exports = userController