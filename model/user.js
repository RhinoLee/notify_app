const db = require("../db")

const userModel = {
  checkUser: async  ({ user_platform_id }) => {
    const query = {
      text: `SELECT 1 FROM users WHERE user_platform_id=$1`,
      values: [user_platform_id]
    }

    try {
      const result = await db.query(query)
      console.log("userModel.checkUser result", result);
      return result.rowCount > 0
    } catch(err) {
      console.log("userModel.checkUser err", err);
      return err
    }
  },
  createLineUser: async ({  access_token, user_platform_id }) => {
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
    } catch(err) {
      console.log("userModel.createLineUser  err",  err);
      return err
    }
  }
}

module.exports = userModel