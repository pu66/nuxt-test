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
        
         <slot />
        
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
