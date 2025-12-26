<template>
    <div class="w-[300px]">
        <h1>Create Customer</h1>
        <el-col class="space-y-2">
            <el-input v-model="fullname" label="Name" placeholder="Name" />
            <el-input v-model="phone" label="Phone" placeholder="Phone" />
            <el-input v-model="email" label="Email" placeholder="Email" />
            <el-input v-model="image" label="Image" placeholder="Image" />
            <el-input v-model="password" label="Password" placeholder="Password" type="password" />
            <el-button @click="create" type="primary">Create</el-button>
        </el-col>

    </div>
</template>
    
<script setup lang="ts">
import { useCustomer } from '~/composables/api/useCustomer';
import type { CustomerPostRequest } from '~/models/customer/request/customer_post_req';

definePageMeta({
    layout: 'trip'
})

let fullname = ref('');
let phone = ref('');
let email = ref('');
let image = ref('');
let password = ref('');
const { createCustomer } = useCustomer();

async function create() {
    console.log(fullname.value, phone.value, email.value, image.value, password.value);
    const request = {
        fullname: fullname.value,
        phone: phone.value,
        email: email.value,
        image: image.value,
        password: password.value,
    } as CustomerPostRequest;
    const response = await createCustomer(request);
    console.log(response);
    if (response.message !== 'Customer created successfully') {
        ElMessage.error(response.message);
    } else {
        ElMessage.success('Customer created successfully');
    }
}
</script>

<style scoped>

</style>
