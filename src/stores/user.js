import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'counter',
  state: () => ({
    token: "",
    isLogin: false,
    userInfo: {},
    lineLoginUrl: "",
  }),
  getters: {
  },
  actions: {
  }
})
