<script setup>
import { RouterView } from 'vue-router'
import Header from "@/components/common/Header.vue"
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()

onMounted(async () => {
  userStore.getUserInfo()
})
</script>

<template>
  <Header></Header>
  <RouterView />
</template>

<style>
</style>
