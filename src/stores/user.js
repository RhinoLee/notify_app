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
    async cancelNotify() {
      const token = localStorage.getItem("token")
      if (token) {
        const api = `${import.meta.env.VITE_BACKEND_HOST}/notify/line/cancel`
        axios.defaults.headers.post['Authorization'] = token;
        const result = await axios.post(api)
      }
      this.userInfo.isNotify = false
    }
  }
})
