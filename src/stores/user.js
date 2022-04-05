import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'counter',
  state: () => ({
    token: "",
    userInfo: {}
  }),
  getters: {
  },
  actions: {
  }
})
