const userModel = require("../model/user");

async function hasAdminUser() {
  const result = await userModel.findAdminUser(1)
  return result.rowCount === 1
}

const seedUtils = {
  createAdmin: async () => {
    const hasAdmin = await hasAdminUser()
    if (hasAdmin) return
    
    const payload = {
      account: process.env.ADMIN_USER_ACCOUNT,
      password: process.env.ADMIN_USER_PASSWORD,
      role: 1
    }

    const result = await userModel.createSeedAdminUser(payload)
  }
}

module.exports = seedUtils