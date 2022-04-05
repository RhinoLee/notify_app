<script setup>
import { useRouter, useRoute } from 'vue-router'
import axios from "axios"
import { onMounted } from '@vue/runtime-core';
import { useUserStore } from "@/stores/user";

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const returnParams = {
  code: route.query.code || "",
  state: route.query.state || "",
}

async function lineLoginHandler() {
  if (!returnParams.code || !returnParams.state) return
  const api = `${import.meta.env.VITE_BACKEND_HOST}/login/line`
  try {
    const result = await axios.post(api, { data: returnParams })
    if (!result.data.success || !result.headers.authorization) {
      userStore.isLogin = false
      return
    }
    const token = result.headers.authorization.split(" ")[1]
    const { userInfo } = result.data
    localStorage.setItem("token", token)
    userStore.userInfo = userInfo
    console.log("userStore.userInfo = userInfo", userInfo);
    userStore.isLogin = true
  } catch (err) {
    userStore.isLogin = false
    console.log("lineLoginHandler err", err);
  } finally {
    router.push({
      name: "home"
    })
  }

}

onMounted(() => {
  lineLoginHandler()
})
</script>