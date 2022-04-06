<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from "@/components/common/Header.vue"
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'
import axios from "axios"

const userStore = useUserStore()

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
