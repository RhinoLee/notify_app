import { defineStore } from 'pinia'
import axios from "axios"

export const useUserStore = defineStore({
  id: 'counter',
  state: () => ({
    token: "",
    isLogin: false,
    isNotify: false,
    userInfo: {},
    lineLoginUrl: "",
    lineNotifyUrl: "",
  }),
  getters: {
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
