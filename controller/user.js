const userModel = require("../model/user");
const tokenHandler = require("../utils/token")
const axios = require("axios")

async function getLoginAccessToken(code) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const params = {
    grant_type: "authorization_code",
    code,
    redirect_uri: `${process.env.CLIENT_ORIGIN}/login/line/return`,
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

async function getNotifyAccessToken(code) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const params = {
    grant_type: "authorization_code",
    code,
    redirect_uri: `${process.env.CLIENT_ORIGIN}/notify/line/return`,
    client_id: process.env.LINE_NOTIFY_ID,
    client_secret: process.env.LINE_NOTIFY_SECRET,
  }

  const searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key])
  })


  try {
    const result = await axios.post("https://notify-bot.line.me/oauth/token", searchParams, { headers })
    return result.data
  } catch (err) {
    console.log("get Access Token result err", err);
    return false
  }
}

async function getUserLineInfo(access_token) {
  const headers = {
    Authorization: `Bearer ${access_token}`
  }

  try {
    const result = await axios.get("https://api.line.me/v2/profile", { headers })
    return result.data
  } catch (err) {
    console.log("getUserInfo result err", err);
    return false
  }
}

async function lineLogout(access_token) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const params = {
    access_token,
    client_id: process.env.LINE_LOGIN_ID,
    client_secret: process.env.LINE_LOGIN_SECRET,
  }

  const searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key])
  })


  try {
    const result = await axios.post("https://api.line.me/oauth2/v2.1/revoke", searchParams, { headers })
    return true
  } catch (err) {
    console.log("get Access Token result err", err);
    return false
  }
}

async function lineCancelNotify(access_token) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${access_token}`
  }

  try {
    const result = await axios.post("https://notify-api.line.me/api/revoke", null, { headers })
    console.log("lineCancelNotify result", result);
    return true
  } catch (err) {
    console.log("lineCancelNotify err", err);
    return false
  }
}

async function notifyPost(tokens) {
  let promises = []
  tokens.forEach(async (token) => {
    console.log("token", token);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token.notify_access_token}`
    }

    const params = {
      message: "yoyo"
    }

    const searchParams = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      searchParams.append(key, params[key])
    })

    promises.push(axios.post("https://notify-api.line.me/api/notify", searchParams, { headers }))
  })

  try {
    const result = await Promise.all(promises)
    console.log("notifyPost result", result);
    return true
  } catch (err) {
    console.log("notifyPost err", err);
    return false
  }
}

const userController = {
  lineLogin: async (req, res) => {
    let json;
    const { code } = req.body.data
    const { access_token } = await getLoginAccessToken(code)

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
            displayName,
            pictureUrl,
            role: 0,
            isNotify: Boolean(updateUserResult.rows[0].notify_access_token)
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
          displayName,
          pictureUrl,
          role: 0,
          isNotify: false
        }
      }
      res.setHeader("Access-Control-Expose-Headers", "Authorization")
      res.setHeader('Authorization', 'Bearer ' + token);
      return res.status(200).json(json)
    }
  },
  lineLogout: async (req, res) => {
    let json;
    const token = req.header('authorization')
    const user_platform_id = tokenHandler.verifyJWT(token)
    const userInfoResult = await userModel.getUserInfo({ user_platform_id })
    const access_token = userInfoResult.rows[0].login_access_token
    const lineLogoutResult = await lineLogout(access_token)
    const userLogoutResult = await userModel.clearLoginAccessToken({ user_platform_id })

    if (lineLogoutResult) {
      json = {
        success: true,
      }

      return res.status(200).json(json)
    } else {
      json = {
        success: false,
      }

      return res.status(400).json(json)
    }
  },
  getUserInfo: async (req, res) => {
    let json;
    const token = req.header('authorization')
    const user_platform_id = tokenHandler.verifyJWT(token)
    const result = await userModel.getUserInfo({ user_platform_id })
    const access_token = result.rows[0].login_access_token
    const userInfo = await getUserLineInfo(access_token)
    userInfo.isNotify = Boolean(result.rows[0].notify_access_token)
    userInfo.role = 0
    json = {
      success: true,
      userInfo
    }

    return res.status(200).json(json)

    json = {
      success: false,
      err: "user not exist"
    }
    return res.status(404).json(json)

    // json = {
    //   success: false,
    //   err: "token required"
    // }
    // return res.status(403).json(json)
  },
  lineNotify: async (req, res) => {
    const { code } = req.body.data
    const { access_token } = await getNotifyAccessToken(code)
    const token = req.header('authorization')
    const user_platform_id = tokenHandler.verifyJWT(token)

    if (!access_token) {
      json = {
        success: false,
      }
      return res.status(403).json(json)
    }

    if (access_token) {
      try {
        const result = await userModel.updateUserNotify({ user_platform_id, access_token })
        json = {
          success: true,
        }
        return res.status(200).json(json)
      } catch (err) {
        json = {
          success: false,
          err
        }
        return res.status(403).json(json)
      }
    }
  },
  lineNotifyPost: async (req, res) => {
    let json;
    const result = await userModel.getNotifyUsers()
    if (result && Array.isArray(result.rows) && result.rows.length > 0) {
      const postResult = await notifyPost(result.rows)
      if (postResult) {
        json = {
          success: true,
        }
        return res.status(200).json(json)
      }

      json = {
        success: false,
        err: postResult
      }
      return res.status(400).json(json)
    }

    json = {
      success: false,
      err: "no user subscribe"
    }
    return res.status(400).json(json)
  },
  cancelNotify: async (req, res) => {
    let json;
    const token = req.header('authorization')
    const user_platform_id = tokenHandler.verifyJWT(token)
    const userInfoResult = await userModel.getUserInfo({ user_platform_id })
    const access_token = userInfoResult.rows[0].notify_access_token
    const lineCancelResult = await lineCancelNotify(access_token)
    const userCancelResult = await userModel.cancelNotify({ user_platform_id })

    if (userCancelResult) {
      json = {
        success: true,
      }

      return res.status(200).json(json)
    } else {
      json = {
        success: false,
      }

      return res.status(400).json(json)
    }
  },
  adminLogin: async (req, res) => {
    let json;
    let result;
    const { adminAccount, adminPassword } = req.body.data
    const token = req.header("authorization") || false

    if (adminAccount && adminPassword) {
      result = await userModel.adminLogin({ role: 1, adminAccount, adminPassword })
    }
    if (!result && token) {
      result = await userModel.verifyAdminUser(token)
    }

    if (result.rowCount === 1) {
      const token = tokenHandler.createAdminToken()
      const updateTokenResult = await userModel.updateAdminToken(token)

      if (updateTokenResult.rowCount === 1) {
        json = {
          success: true,
          role: 1
        }
        res.setHeader("Access-Control-Expose-Headers", "Authorization")
        res.setHeader('Authorization', 'Bearer ' + token);
        return res.status(200).json(json)
      }

      json = {
        success: false,
      }
      return res.status(400).json(json)
    }
    json = {
      success: false
    }
    return res.status(400).json(json)
  },
  adminLogout: async (req, res) => {
    let json;
    const token = req.header("authorization")
    const result = await userModel.adminLogout(token)
    if (result) {
      json = {
        success: true
      }

      return res.status(200).json(json)
    }

    json = {
      success: false
    }

    return res.status(400).json(json)
  }
}

module.exports = userController