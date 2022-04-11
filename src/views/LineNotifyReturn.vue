<script setup>
import { useRouter, useRoute } from 'vue-router'
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
  const result = await userStore.lineNotifyHandler(returnParams)
  router.push({
    name: "home"
  })
}

onMounted(() => {
  lineNotifyHandler()
})
</script>