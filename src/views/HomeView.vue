<script setup>
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLogin, userInfo } = storeToRefs(userStore)

</script>

<template>
  <div class="container">
    <div v-if="isLogin">
      <!-- <div>{{ userInfo.displayName }}</div> -->
      <div class="avatar"><img :src="userStore.userInfo.pictureUrl" alt=""></div>
    </div>
  </div>
</template>


<style scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 50px auto 0px auto;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}
</style>