<script setup>
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLogin, userInfo, lineNotifyUrl } = storeToRefs(userStore)

</script>

<template>
  <div class="container">
    <div class="wrapper" v-if="isLogin">
      <template v-if="userInfo.role === 0">
        <div class="avatar">
          <img :src="userStore.userInfo.pictureUrl" alt />
        </div>
        <div>
          <span v-if="userInfo.isNotify">訂閱狀態： 已訂閱</span>
          <span v-else>訂閱狀態： 未訂閱</span>
        </div>
        <a :href="lineNotifyUrl" v-if="!userInfo.isNotify" class="notify">訂閱通知</a>
        <button v-if="userInfo.isNotify" @click="userStore.cancelNotify" class="notify cancel">取消訂閱</button>
      </template>

      <button v-if="userInfo.role === 1" @click="userStore.postNotify" class="notify post">發送通知</button>
    </div>
  </div>
</template>


<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 50px auto 30px auto;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.notify {
  display: inline-block;
  margin-top: 5px;
  padding: 5px 10px;
  background: #07b53b;
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  letter-spacing: 1px;
  border-radius: 5px;
  outline: none;
  border: none;
}
.notify.cancel {
  background: #d63384;
}

.notify.post {
  margin-top: 50px;
}
</style>