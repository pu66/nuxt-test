
<template>
    <div>
        <h1>Delete Customer</h1>
        <el-input v-model="idx" label="Index" placeholder="Index" />
        <el-button @click="delCustomer" type="primary">Delete</el-button>
    </div>
</template>

<script setup lang="ts">
import { useCustomer } from '~/composables/api/useCustomer';

definePageMeta({
    layout: 'trip'
})

const { deleteCustomer } = useCustomer();
let idx = ref(0);

async function delCustomer() {
    const response = await deleteCustomer(idx.value);
    if (response.message !== 'Customer deleted successfully') {
        ElMessage.error(response.message);
    } else {
        ElMessage.success('Customer deleted successfully');
    }
}
</script>

<style scoped>

</style>