<template>
    <div>
        <h1>Trip {{ $route.params.idx }}</h1>
        <h1>{{ trip?.name }}</h1>
        <img :src="trip?.coverimage" alt="Trip Cover Image" />
    </div>
</template>

<script setup lang="ts">
import { useTrips } from '~/composables/api/useTrip';
import type { TripGetResponse } from '~/models/trip/trip_get_res';

definePageMeta({
    layout: 'trip'
})

const route = useRoute();
const { getTrip } = useTrips();

let trip = ref<TripGetResponse>();
onMounted(async () => {
    const response = await getTrip(Number(route.params.idx));
    trip.value = response;
})

</script>

<style scoped></style>