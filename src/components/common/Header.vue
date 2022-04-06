<script setup>
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { lineLoginUrl } = userStore
const { isLogin, userInfo } = storeToRefs(userStore)

async function logoutHandler() {
  userStore.logoutHandler()
}

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img
          src="@/assets/images/robot.png"
          width="30"
          height="24"
          class="d-inline-block align-text-top"
        />
        Notify
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>-->
        </ul>
        <div class="d-flex">
          <!-- user -->
          <template v-if="isLogin">
            <div class="user-name">
              <span>Hi, {{ userInfo.displayName }}</span>
            </div>
            <button @click="logoutHandler" class="ms-3">登出</button>
          </template>
          <a v-else :href="lineLoginUrl" class="login">Line Login</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.user-name {
  display: flex;
  align-items: center;
}
button {
  border: none;
  outline: none;
  background: transparent;
  color: #d63384;
}
.login {
  display: block;
  padding: 5px 10px;
  background: #07b53b;
  color: #FFF;
  font-weight: bold;
  text-decoration: none;
  letter-spacing: 1px;
  border-radius: 5px;
}
</style>