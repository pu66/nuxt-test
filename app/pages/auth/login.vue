<!-- <template>
  <div class="container">
    <el-card shadow="always" class="upload-card">
      <template #header>
        <h2 class="text-center">ตรวจสอบสลิป (SlipOk)</h2>
      </template>

      <div class="form-group">
        <label class="block mb-2 text-sm font-bold">เลือกไฟล์สลิป</label>
        <input type="file" @change="handleFileChange" accept="image/*" class="mb-4" />
        
        <div v-if="imagePreview" class="preview-wrapper">
          <img :src="imagePreview" class="preview-img" />
        </div>

        <el-button 
          type="primary" 
          @click="upload" 
          :loading="isLoading" 
          :disabled="!file"
          class="w-full"
        >
          ตรวจสอบทันที
        </el-button>
      </div>

      <div v-if="response">
        <el-divider />
        
        <div :class="['status-header', response.success ? 'success' : 'error']">
          {{ response.success ? 'ตรวจสอบสำเร็จ' : 'สลิปไม่ถูกต้อง' }}
        </div>

        <div class="response-details" v-if="response.success">
          </div>

        <details class="mt-4">
          <summary class="text-xs cursor-pointer text-gray-400">ดู JSON ทั้งหมด</summary>
          <pre class="json-box">{{ response }}</pre>
        </details>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSlipOk } from '~/composables/api/useSlipOk';
import type { SlipPostResponse } from '~/models/slip/slip_res';
import { ElMessage } from 'element-plus';

const file = ref<File | null>(null);
const imagePreview = ref<string>('');
const response = ref<SlipPostResponse | null>(null);
const isLoading = ref(false);

const { checkSlip } = useSlipOk();

definePageMeta({
  layout: 'trip'
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    file.value = target.files[0];
    imagePreview.value = URL.createObjectURL(file.value);
    response.value = null; // ล้างค่าเก่าเมื่อเลือกรูปใหม่
  }
};

const upload = async () => {
  if (!file.value) return;
console.log('Uploading file:', file.value);
  isLoading.value = true;
  try {
    const res = await checkSlip(file.value);
    // เก็บค่า res ไว้ใน response โดยตรง
    response.value = res;
console.log('Upload Response:', res);
    if (res.success === true) {
        console.log('Success:', res);
      ElMessage.success('ตรวจสอบสลิปเรียบร้อย สลิปถูกต้อง');
    } else {
        console.log('Error:', res);
      ElMessage.error('สลิปไม่ถูกต้อง');
    }
  } catch (err) {
    console.error('Upload Error:', err);
    ElMessage.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  } finally {
    isLoading.value = false;
  }
};
</script>
<style scoped></style> -->
<script setup lang="ts">
import { ref } from "vue";
import { GoogleSignInButton, type CredentialResponse } from "vue3-google-signin";
import { useLogin } from "~/composables/api/useLogin";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "~/stores/auth";

const { login, googleLogin } = useLogin();
const appDataStore = useAppData();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

interface GoogleUser {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}
const googleUser = ref<GoogleUser | null>(null);

definePageMeta({
    layout: 'trip'
})
 async function handleAuthSuccess(result: any) {
 authStore.setUser(result.user); 
  appDataStore.setFullName(result.user.fullname);
  ElMessage.success("ยินดีต้อนรับ!");
    await navigateTo("/", { replace: true });

}

// Email & Password Login
async function onLogin() {
  const result = await login(email.value, password.value);
  console.log("Login result:", result);

  if (result.success) {
    handleAuthSuccess(result);
  } else {
    ElMessage.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
  }
}

// Google Login
const handleGoogleSuccess = async (response: CredentialResponse) => {
  console.log("Google response:", response);

  if (!response.credential) return;

  const result = await googleLogin(response.credential);
   const decoded = jwtDecode<GoogleUser>(response.credential);
  googleUser.value = decoded;

  console.log("Decoded Google User:", decoded);
  console.log("Google Login result:", result);

  if (result.success) {
    handleAuthSuccess(result);
  } else {
    ElMessage.error("Google Login ล้มเหลว");
  }
};

const handleGoogleError = () => {
  console.error("Google Sign-In failed");
};
</script>


<template>
  <div class="login-container">
    <!-- Email & Password Login Form -->
    <el-form @submit.prevent="onLogin" class="login-form">
      <el-form-item label="Email">
        <el-input v-model="email" type="email" placeholder="กรอกอีเมล" required />
      </el-form-item>
      
      <el-form-item label="Password">
        <el-input 
          v-model="password" 
          type="password" 
          placeholder="กรอกรหัสผ่าน" 
          required 
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="false">
          เข้าสู่ระบบ
        </el-button>
      </el-form-item>
    </el-form>

    <!-- Divider -->
    <div class="divider">
      <span>หรือ</span>
    </div>

    <!-- Google Sign-In Button -->
    <div class="google-signin-wrapper">
     <GoogleSignInButton
  @success="handleGoogleSuccess"
  @error="handleGoogleError"
/>

    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}

.login-form {
  margin-bottom: 20px;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #dcdfe6;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  padding: 0 10px;
  background-color: white;
  color: #909399;
}

.google-signin-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

<!-- <template>
  <div>
    <!-- Email & Password Login -->
    <!-- <form @submit.prevent="onLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form> --> 

    <!-- Google Sign-In Button -->
    <!-- <GoogleSignInButton
      @success="handleGoogleSuccess"
      @error="handleGoogleError"
    />
  </div>
</template> -->