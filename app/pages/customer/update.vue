<template>
    <div>
        <h1>Update Customer</h1>
        <el-input v-model="idx" label="Index" placeholder="Index" />
        <el-button @click="getCustomer" type="primary">Get</el-button>
        <div v-if="customer">
            <el-input v-model="customer.fullname" label="Name" placeholder="Name" />
            <el-input v-model="customer.phone" label="Phone" placeholder="Phone" />
            <el-input v-model="customer.email" label="Email" placeholder="Email" />
            <el-input v-model="customer.image" label="Image" placeholder="Image" />
            <el-button @click="update" type="primary">Update</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCustomer } from '~/composables/api/useCustomer';
import type { CustomerPostRequest } from '~/models/customer/request/customer_post_req';
import type { CustomerGetResponse } from '~/models/customer/response/customer_get_res';

definePageMeta({
    layout: 'trip'
})

let idx = ref(0);
let customer = ref<CustomerGetResponse>();


const { getCustomerById, updateCustomer } = useCustomer();

async function getCustomer() {
    const response = await getCustomerById(idx.value);
    console.log(response);    
    customer.value = response;
}

async function update() {
    const request = {
        fullname: customer.value?.fullname,
        phone: customer.value?.phone,
        email: customer.value?.email,
        image: customer.value?.image,
    } as CustomerPostRequest;
    const response = await updateCustomer(idx.value, request);
    console.log(response);
    if (response.message !== 'Customer updated successfully') {
        ElMessage.error(response.message);
    } else {
        ElMessage.success('Customer updated successfully');
    }
}
</script>

<style scoped>

</style>