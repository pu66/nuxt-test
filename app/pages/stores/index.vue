<template>
    <div>
        <h1>Store Pinia</h1>
        <el-input v-model="fullName" label="Full Name" placeholder="Full Name" />
        <el-button @click="setFullName" type="primary">Set</el-button>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'trip'
})

import { useAppData } from '~/stores/app_data';

const appData = useAppData();
let fullName = ref('');

function setFullName() {
    appData.setFullName(fullName.value);
}
</script>

<style scoped>

</style>