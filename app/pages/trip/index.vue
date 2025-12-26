<template>
    <div>
        <h1>Trip {{ $route.query.idx }}</h1>
    </div>
</template>

<script setup lang="ts">
import type { TripGetResponse } from '~/models/trip/trip_get_res';

definePageMeta({
    layout: 'trip'
})

import { useAppData } from '~/stores/app_data';
const appData = useAppData();
onMounted(() => {
    console.log(appData.fullName);
})


</script>

<style scoped></style>
