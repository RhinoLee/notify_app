<script setup>
import { ref, onMounted } from "vue"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from 'pinia'

const closeModal = ref(null)

const userStore = useUserStore()
const { lineLoginUrl } = userStore
const { isLogin, userInfo, adminAccount, adminPassword } = storeToRefs(userStore)

async function adminLogin() {
  const result = await userStore.adminLogin()
  if (result) {
    userStore.adminAccount = ""
    userStore.adminPassword = ""
    loginModal.click()
  }
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
          <template v-if="isLogin && userInfo.role === 0">
            <div class="user-name">
              <span>Hi, {{ userInfo.displayName }}</span>
            </div>
            <button @click="userStore.logoutHandler" class="ms-3">登出</button>
          </template>
          <template v-if="isLogin && userInfo.role === 1">
            <div class="user-name">
              <span>Hi, {{ userInfo.displayName }}</span>
            </div>
            <button @click="userStore.adminLogout" class="ms-3">登出</button>
          </template>
          <template v-if="!isLogin">
            <button
              type="button"
              class="login admin btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >Admin Login</button>
            <a :href="lineLoginUrl" class="login">Line Login</a>
          </template>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Admin Login</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="account-name" class="col-form-label">Account:</label>
                <input type="text" class="form-control" id="account-name" v-model.trim="adminAccount" />
              </div>
              <div class="mb-3">
                <label for="password" class="col-form-label">Password:</label>
                <input type="text" class="form-control" id="password" v-model.trim="adminPassword" @keyup.enter="adminLogin" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button ref="closeModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="adminLogin">Send</button>
          </div>
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
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  letter-spacing: 1px;
  border-radius: 5px;
}
.login.admin {
  margin-right: 10px;
  background: rgb(29, 155, 240);
}
</style>