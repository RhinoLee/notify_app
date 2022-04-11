import axios from "axios"

const lineRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST}/line`
})

const userRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST}/user`
})

const adminRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST}/admin`
})


export const lineNotifySubscribe = (data) => lineRequest.post("/notify", data, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})

export const lineNotifyCancel = () => lineRequest.post("/notify/cancel", null, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})

export const lineLogin = (data) => lineRequest.post("/login", data)

export const lineLogout = () => lineRequest.post("/logout", null, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})

export const linePostNotify = () => lineRequest.post("/notify/post", null, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})

export const getUserInfo = () => userRequest.post("/userInfo", null, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})

export const adminLogin = (data) => adminRequest.post("/login", data, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})

export const adminLogout = () => adminRequest.post("/logout", null, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})
