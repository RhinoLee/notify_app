import { defineStore } from 'pinia'
import axios from "axios"
import { lineNotifySubscribe, lineNotifyCancel, lineLogin, lineLogout, getUserInfo, linePostNotify, adminLogin, adminLogout } from "@/utils/api"

export const useUserStore = defineStore({
  id: 'counter',
  state: () => ({
    token: "",
    isLogin: false,
    isNotify: false,
    userInfo: {},
    lineLoginParams: {
      response_type: "code",
      client_id: import.meta.env.VITE_LINE_CLIENT_ID,
      redirect_uri: `${import.meta.env.VITE_BASE_HOST}/login/line/return`,
      state: "12345",
      scope: "profile openid email",
    },
    lineNotifyParams: {
      response_type: "code",
      client_id: import.meta.env.VITE_LINE_NOTIFY_ID,
      redirect_uri: `${import.meta.env.VITE_BASE_HOST}/notify/line/return`,
      state: "12345",
      scope: "notify",
    },
    lineLoginUrl: "",
    lineNotifyUrl: "",
    adminAccount: "",
    adminPassword: "",

  }),
  getters: {
    lineLoginUrl(state) {
      const loginUrl = new URL(import.meta.env.VITE_LINE_LOGIN_ENDPOINT)
      const searchParams = new URLSearchParams(state.lineLoginParams)
      loginUrl.search = searchParams
      console.log("loginUrl.href", loginUrl.href);
      return loginUrl.href
    },
    lineNotifyUrl(state) {
      const notifyUrl = new URL(import.meta.env.VITE_LINE_NOTIFY_ENDPOINT)
      const searchParams = new URLSearchParams(state.lineNotifyParams)
      notifyUrl.search = searchParams
      return notifyUrl.href
    }
  },
  actions: {
    async lineNotifyHandler(returnParams) {
      if (!returnParams.code || !returnParams.state) return
      console.log("returnParams", returnParams);
      try {
        const result = await lineNotifySubscribe({ data: returnParams })
        this.userInfo.isNotify = result.data.success

        return result
      } catch (err) {
        console.log("lineNotifyHandler err", err);
        this.userInfo.isNotify = false

        return err
      }
    },
    async cancelNotify() {
      const result = await lineNotifyCancel()
      this.userInfo.isNotify = false
    },
    async lineLoginHandler(returnParams) {
      if (!returnParams.code || !returnParams.state) return
      try {
        const result = await lineLogin({ data: returnParams })
        if (!result.data.success || !result.headers.authorization) {
          this.isLogin = false
          return
        }
        const token = result.headers.authorization.split(" ")[1]
        localStorage.setItem("token", token)

        this.userInfo = result.data.userInfo
        this.isLogin = true

        return result
      } catch (err) {
        console.log("lineLoginHandler err", err);
        this.isLogin = false

        return err
      }
    },
    async logoutHandler() {
      const result = await lineLogout()

      this.isLogin = false
      this.token = ""
      this.userInfo = {}
      localStorage.removeItem("token");
    },
    async getUserInfo() {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")
      if (token && !role) {
        const result = await getUserInfo()
        this.isLogin = result.data.success
        this.userInfo = result.data.userInfo
        return
      }
      if (token && role) {
        this.adminLogin()
        return
      }
      this.isLogin = false
    },
    async postNotify() {
      const result = await linePostNotify()
    },
    async adminLogin() {
      const payload = {
        adminAccount: this.adminAccount,
        adminPassword: this.adminPassword
      }
      const result = await adminLogin({ data: payload })
      if (result.data.success) {
        const token = result.headers.authorization.split(" ")[1]
        localStorage.setItem("token", token)
        localStorage.setItem("role", result.data.role)
        this.isLogin = true
        this.userInfo.displayName = "Admin"
        this.userInfo.role = result.data.role
      }
      return result.data.success
    },
    async adminLogout() {
      const result = await adminLogout()
      this.isLogin = false
      this.userInfo = {}
      localStorage.removeItem("token")
      localStorage.removeItem("role")
    }
  }
})
