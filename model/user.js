const db = require("../db")

const userModel = {
  createLineUser: async ({ access_token, user_platform_id }) => {
    const query = {
      text: `INSERT INTO 
            users(login_access_token, platform, user_platform_id) 
            VALUES($1, $2, $3) RETURNING *`,
      values: [access_token, "line", user_platform_id],
    };

    try {
      const result = db.query(query)
      console.log("userModel.createLineUser result", result);
      return result
    } catch (err) {
      console.log("userModel.createLineUser  err", err);
      return err
    }
  },
  updateLineUserToken: async ({ access_token, user_platform_id }) => {
    const query = {
      text: `UPDATE users SET login_access_token = $1 WHERE user_platform_id = $2`,
      values: [access_token, user_platform_id]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.updateLineUserToken result", result);
      return result
    } catch (err) {
      console.log("userModel.updateLineUserToken err", err);
      return err
    }
  },
  getUserInfo: async ({ user_platform_id }) => {
    const query = {
      text: `SELECT login_access_token, notify_access_token FROM users WHERE user_platform_id=$1`,
      values: [user_platform_id]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.getUserInfo result", result);
      return result
    } catch (err) {
      console.log("userModel.getUserInfo err", err);
      return err
    }
  },
  updateUserNotify: async ({ access_token, user_platform_id }) => {
    const query = {
      text: `UPDATE users SET notify_access_token = $1 WHERE user_platform_id = $2`,
      values: [access_token, user_platform_id]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.updateUserNotify result", result);
      return result
    } catch (err) {
      console.log("userModel.updateUserNotify err", err);
      return err
    }
  },
  clearLoginAccessToken: async ({ user_platform_id }) => {
    const query = {
      text: `UPDATE users SET login_access_token = $1 WHERE user_platform_id=$2`,
      values: ["", user_platform_id]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.clearLoginAccessToken result", result);
      return result
    } catch (err) {
      console.log("userModel.clearLoginAccessToken err", err);
      return err
    }
  },
  cancelNotify: async ({ user_platform_id }) => {
    const query = {
      text: `UPDATE users SET notify_access_token = $1 WHERE user_platform_id=$2`,
      values: [null, user_platform_id]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.cancelNotify result", result);
      return result
    } catch (err) {
      console.log("userModel.cancelNotify err", err);
      return err
    }
  },
  getNotifyUsers: async () => {
    const query = {
      text: "SELECT notify_access_token FROM users WHERE notify_access_token IS NOT NULL;"
    }

    try {
      const result = await db.query(query)
      console.log("userModel.getNotifyUsers result", result);
      return result
    } catch (err) {
      console.log("userModel.getNotifyUsers err", err);
      return err
    }
  }
}

module.exports = userModel