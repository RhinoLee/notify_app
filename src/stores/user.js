import { defineStore } from 'pinia'
import axios from "axios"

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
      redirect_uri: "http://localhost:3000/login/line/return",
      state: "12345",
      scope: "profile openid email",
    },
    lineNotifyParams: {
      response_type: "code",
      client_id: import.meta.env.VITE_LINE_NOTIFY_ID,
      redirect_uri: "http://localhost:3000/notify/line/return",
      state: "12345",
      scope: "notify",
    },
    lineLoginUrl: "",
    lineNotifyUrl: "",
  }),
  getters: {
    lineLoginUrl(state) {
      const loginUrl = new URL(import.meta.env.VITE_LINE_LOGIN_ENDPOINT)
      const searchParams = new URLSearchParams(state.lineLoginParams)
      loginUrl.search = searchParams
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
      const api = `${import.meta.env.VITE_BACKEND_HOST}/notify/line`
      try {
        const result = await axios.post(api, { data: returnParams })
        this.userInfo.isNotify = result.data.success

        return result
      } catch (err) {
        console.log("lineNotifyHandler err", err);
        this.userInfo.isNotify = false

        return err
      }
    },
    async cancelNotify() {
      const token = localStorage.getItem("token")
      if (token) {
        const api = `${import.meta.env.VITE_BACKEND_HOST}/notify/line/cancel`
        axios.defaults.headers.post['Authorization'] = token;
        const result = await axios.post(api)
      }
      this.userInfo.isNotify = false
    },
    async lineLoginHandler(returnParams) {
      if (!returnParams.code || !returnParams.state) return
      const api = `${import.meta.env.VITE_BACKEND_HOST}/login/line`
      try {
        const result = await axios.post(api, { data: returnParams })
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
      const api = `${import.meta.env.VITE_BACKEND_HOST}/logout/line`
      axios.defaults.headers.post['Authorization'] = localStorage.getItem("token");
      const result = await axios.post(api)

      this.isLogin = false
      this.token = ""
      localStorage.removeItem("token");
    },
    async getUserInfo() {
      const token = localStorage.getItem("token")
      if (token) {
        const api = `${import.meta.env.VITE_BACKEND_HOST}/user/userInfo`
        axios.defaults.headers.post['Authorization'] = token;
        const result = await axios.post(api)
        this.isLogin = result.data.success
        this.userInfo = result.data.userInfo
        return
      }
      this.isLogin = false
    },
  }
})
