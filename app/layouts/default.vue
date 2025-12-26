<template>
    <nav>
        <ul class="flex space-x-4 mb-4">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/trip">Trip</NuxtLink></li>
        </ul>
    </nav>
    <!-- <div>
        <h1 class="text-2xl font-">Default Layout</h1>
    
    </div> -->
      <main>
        <slot />
    </main>
</template>

<script setup lang="ts">

</script>
<style scoped>
</style>