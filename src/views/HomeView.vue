<script setup>
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLogin, userInfo, lineNotifyUrl } = storeToRefs(userStore)

</script>

<template>
  <div class="container">
    <div v-if="isLogin">
      <template v-if="userInfo.role === 0">
        <div class="avatar">
          <img :src="userStore.userInfo.pictureUrl" alt />
        </div>
        <a :href="lineNotifyUrl" v-if="!userInfo.isNotify">訂閱通知</a>
        <div v-if="userInfo.isNotify">已訂閱通知</div>
        <button v-if="userInfo.isNotify" @click="userStore.cancelNotify">取消訂閱</button>
      </template>

      <button v-if="userInfo.role === 1" @click="userStore.postNotify">發送通知</button>
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