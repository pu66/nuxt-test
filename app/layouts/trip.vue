<template>
    <div>
        <h1>Trip Layout</h1>
        <el-button type="text" 
        @click="navigateTo('/trip')">Home</el-button>

        <el-button type="text"
        @click="navigateTo('/customer/create')">create customer</el-button>
         <el-button type="text" @click="navigateTo('/customer/delete')">Delete Customer</el-button>
         <el-button type="text" @click="navigateTo('/customer/update')">Update Customer</el-button>
          <el-button type="text" @click="navigateTo('/upload')">Upload</el-button> 
        <el-button type="text" @click="navigateTo('/payment/qr')">QR Code</el-button> 
        <el-button type="text" @click="navigateTo('/payment/checkslipok')">อัพสลิป</el-button> 
<el-button type="primary" @click="navigateTo('/read/31')">
  อ่านเล่มนี้
</el-button>
        <button @click="handleLogout" class="btn-logout">
    ออกจากระบบ
  </button>
         <slot />
        
    </div>
</template>

<script setup lang="ts">
import { useLogin } from '~/composables/api/useLogin';

    const { logout } = useLogin();
const handleLogout = () => {
  if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
    logout();
  }
};
</script>

  

<style scoped>

</style>
