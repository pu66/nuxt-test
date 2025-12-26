<!-- <template>
  <div>
    <h1>Login</h1>

    <el-input
      v-model="email"
      placeholder="Email"
      type="email"
      class="mb-2"
    />

    <el-input
      v-model="password"
      placeholder="Password"
      type="password"
      show-password
      class="mb-2"
    />

    <el-button
      type="primary"
      :loading="loading"
      @click="handleLogin"
    >
      Login
    </el-button>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue'
import { useLogin } from '~/composables/api/useLogin'
import { useAuthStore } from '~/stores/auth'
import type { LoginUser } from '~/models/auth/login_res'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { login } = useLogin()
const auth = useAuthStore()

async function handleLogin() {
  // ตรวจสอบ input ก่อน
  if (!email.value || !password.value) {
    error.value = 'กรุณากรอก Email และ Password'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('Attempting login with:', email.value) // debug
    
    const user: LoginUser = await login(email.value, password.value)
    
    console.log('Login successful, user:', user) // debug
    
    auth.setUser(user)
    
    // redirect หลัง login สำเร็จ
    await navigateTo('/')
    
  } catch (e: any) {
    console.error('Login failed:', e) // debug
    console.error('Error details:', e.response?.data) // debug
    
    error.value = e.response?.data?.message 
      || e.message 
      || 'Email หรือ Password ไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped></style> -->
<script setup lang="ts">
import { useLogin } from '~/composables/api/useLogin';

const email = ref('');
const password = ref('');
const { login } = useLogin(); // เรียกใช้ composable

async function onLogin() {
  const result = await login(email.value, password.value);

  if (result.success) {
    ElMessage.success("ยินดีต้อนรับ!");
    
    // หลังจาก Login สำเร็จ และ Token ถูกเซฟลง Cookie แล้ว
    // Middleware (รปภ.) จะปล่อยให้เราผ่านไปหน้าอื่นได้
    navigateTo('/customer/create'); 
  } else {
    ElMessage.error( "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"   );
  }
}
</script>

<template>
  <el-input v-model="email" placeholder="Email" />
  <el-input v-model="password" type="password" placeholder="Password" />
  <el-button @click="onLogin">เข้าสู่ระบบ</el-button>
</template>