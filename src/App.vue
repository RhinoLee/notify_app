<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from "@/components/common/Header.vue"
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'
import axios from "axios"

const userStore = useUserStore()
const lineLoginParams = {
  url: "https://access.line.me/oauth2/v2.1/authorize",
  response_type: "code",
  client_id: import.meta.env.VITE_LINE_CLIENT_ID,
  redirect_uri: "http://localhost:3000/login/line/return",
  state: "12345",
  scope: "profile%20openid%20email",
}
const lineNotifyParams = {
  url: "https://notify-bot.line.me/oauth/authorize",
  response_type: "code",
  client_id: import.meta.env.VITE_LINE_NOTIFY_ID,
  redirect_uri: "http://localhost:3000/notify/line/return",
  state: "12345",
  scope: "notify",
}

const lineLoginUrl = `${lineLoginParams.url}?response_type=${lineLoginParams.response_type}&client_id=${lineLoginParams.client_id}&redirect_uri=${lineLoginParams.redirect_uri}&state=${lineLoginParams.state}&scope=${lineLoginParams.scope}}`
const lineNotifyUrl = `${lineNotifyParams.url}?response_type=${lineNotifyParams.response_type}&client_id=${lineNotifyParams.client_id}&redirect_uri=${lineNotifyParams.redirect_uri}&state=${lineNotifyParams.state}&scope=${lineNotifyParams.scope}`
userStore.lineLoginUrl = lineLoginUrl
userStore.lineNotifyUrl = lineNotifyUrl

onMounted(async () => {
  // 檢查 localStorage 是否有 token，有的話跟 server 要 userInfo，沒有則顯示登入 UI
  const token = localStorage.getItem("token")
  if (token) {
    const api = `${import.meta.env.VITE_BACKEND_HOST}/user/userInfo`
    axios.defaults.headers.post['Authorization'] = token;
    const result = await axios.post(api)
    userStore.isLogin = result.data.success
    userStore.userInfo = result.data.userInfo
    return
  }
  userStore.isLogin = false
})
</script>

<template>
  <Header></Header>
  <RouterView />
</template>

<style>
</style>
