<script setup>
import { useRouter, useRoute } from 'vue-router'
import axios from "axios"
import { onMounted } from '@vue/runtime-core';
import { useUserStore } from "@/stores/user";
const route = useRoute()
const router = useRouter()
// line login return url
// http://localhost:3000/login/line/return?code=qrBECMjylc1riaGfc3Mz&state=12345
const returnParams = {
  code: route.query.code || "",
  state: route.query.state || "",
}

async function lineLoginHandler() {
  if (!returnParams.code || !returnParams.state) return
  const api = `${import.meta.env.VITE_BACKEND_HOST}/login/line`
  try {
    const result = await axios.post(api, { data: returnParams })
    console.log("lineLoginHandler result.headers", result.headers);
    console.log("lineLoginHandler result", result);
    if (!result.data.success || !result.headers.authorization) return
    const token = result.headers.authorization.split(" ")[1]
    const { userInfo } = result.data
    localStorage.setItem("token", token)
    useUserStore.userInfo = userInfo
  } catch (err) {
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