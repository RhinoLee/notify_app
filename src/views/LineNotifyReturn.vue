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

async function lineNotifyHandler() {
  if (!returnParams.code || !returnParams.state) return
  console.log("returnParams", returnParams);
  const api = `${import.meta.env.VITE_BACKEND_HOST}/notify/line`
  try {
    const result = await axios.post(api, { data: returnParams })
    userStore.userInfo.isNotify = result.data.success
  } catch (err) {
    userStore.userInfo.isNotify = false
    console.log("lineNotifyHandler err", err);
  } finally {
    router.push({
      name: "home"
    })
  }

}

onMounted(() => {
  lineNotifyHandler()
})
</script>