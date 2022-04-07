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
  },
  createSeedAdminUser: async ({ account, password, role }) => {
    const query = {
      text: `INSERT INTO 
              users (account, password, role)
              VALUES($1, $2, $3) RETURNING *`,
      values: [account, password, role]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.createSeedAdminUser result", result);
      return result
    } catch (err) {
      console.log("userModel.createSeedAdminUser err", err);
      return err
    }
  },
  findAdminUser: async (role) => {
    const query = {
      text: "SELECT id FROM users WHERE role = $1",
      values: [role]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.findAdminUser result", result);
      return result
    } catch (err) {
      console.log("userModel.findAdminUser err", err);
      return err
    }

  },
  adminLogin: async ({ role, adminAccount, adminPassword }) => {
    const query = {
      text: "SELECT id FROM users WHERE role = $1 AND account = $2 AND password = $3",
      values: [role, adminAccount, adminPassword]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.adminLogin result", result);
      return result
    } catch (err) {
      console.log("userModel.adminLogin err", err);
      return err
    }
  },
  updateAdminToken: async (token) => {
    const query = {
      text: `UPDATE users SET login_access_token = $1 WHERE role = $2 RETURNING *`,
      values: [token, 1]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.updateAdminToken result", result);
      return result
    } catch (err) {
      console.log("userModel.updateAdminToken err", err);
      return err
    }
  },
  verifyAdminUser: async (token) => {
    const query = {
      text: "SELECT id, account, role FROM users WHERE role = $1 AND login_access_token = $2",
      values: [1, token]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.verifyAdminUser result", result);
      return result
    } catch (err) {
      console.log("userModel.verifyAdminUser err", err);
      return err
    }
  }
}

module.exports = userModel