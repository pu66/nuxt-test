<template>
    <div>
        <h1>Trip Home</h1>
        <Banner />
        <BaseBanner />
        <h1>{{ $route.query.idx }}</h1>
        <el-button type="primary" class="w-80" >Click me</el-button>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
console.log(route.query.idx);
</script>

<style scoped>

</style>