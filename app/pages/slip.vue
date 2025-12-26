<script setup>
import { ref } from 'vue'

// แทนที่ useState ด้วย ref
const slipOkData = ref([])
const files = ref(null)

// ฟังก์ชันสำหรับจัดการการเลือกไฟล์
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    files.value = file
  }
}

// ฟังก์ชันสำหรับส่งฟอร์ม (Submit)
const handleSubmit = async () => {
  if (!files.value) return
  
  console.log("Checking slip...", files.value)
  // เพิ่ม Logic การเรียก API ของ SlipOk ที่นี่
}
</script>

<template>
  <main class="container mx-auto my-5">
    <h3 class="text-3xl font-bold">
      Nuxt 3 & SlipOk เช็คสลิปโอนเงินอัตโนมัติด้วย AI
    </h3>

    <form @submit.prevent="handleSubmit">
      <input 
        type="file" 
        accept="image/*" 
        class="block my-3" 
        @change="handleFileChange"
      />
      
      <button 
        type="submit" 
        class="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition"
      >
        Check Slip
      </button>
    </form>

    <div v-if="slipOkData.length > 0" class="mt-5">
      <pre>{{ slipOkData }}</pre>
    </div>
  </main>
</template>