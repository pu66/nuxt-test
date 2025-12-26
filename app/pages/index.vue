<template>
    <div>
        <h1>Get Store Pinia</h1>
        <h1>Full Name: {{ fullName }}</h1>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'trip'
})

import { useAppData } from '~/stores/app_data';

const appData = useAppData();
let fullName = ref('');

onMounted(() => {
    fullName.value = appData.fullName;
})

</script>

<style scoped>

</style>