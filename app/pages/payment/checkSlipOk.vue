<template>
  <div class="container">
    <el-card shadow="always" class="upload-card">
      <template #header>
        <h2 class="text-center">ตรวจสอบสลิป (SlipOk)</h2>
      </template>

      <div class="form-group">
        <label class="block mb-2 text-sm font-bold">เลือกไฟล์สลิป</label>
        <input type="file" @change="handleFileChange" accept="image/*" class="mb-4" />
        
        <div v-if="imagePreview" class="preview-wrapper">
          <img :src="imagePreview" class="preview-img" />
        </div>

        <el-button 
          type="primary" 
          @click="upload" 
          :loading="isLoading" 
          :disabled="!file"
          class="w-full"
        >
          ตรวจสอบทันที
        </el-button>
      </div>

      <div v-if="response">
        <el-divider />
        
        <div :class="['status-header', response.success ? 'success' : 'error']">
          {{ response.success ? 'ตรวจสอบสำเร็จ' : 'สลิปไม่ถูกต้อง' }}
        </div>

        <div class="response-details" v-if="response.success">
          </div>

        <details class="mt-4">
          <summary class="text-xs cursor-pointer text-gray-400">ดู JSON ทั้งหมด</summary>
          <pre class="json-box">{{ response }}</pre>
        </details>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSlipOk } from '~/composables/api/useSlipOk';
import type { SlipPostResponse } from '~/models/slip/slip_res';
import { ElMessage } from 'element-plus';

const file = ref<File | null>(null);
const imagePreview = ref<string>('');
const response = ref<SlipPostResponse | null>(null);
const isLoading = ref(false);

const { checkSlip } = useSlipOk();

definePageMeta({
  layout: 'trip'
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    file.value = target.files[0];
    imagePreview.value = URL.createObjectURL(file.value);
    response.value = null; // ล้างค่าเก่าเมื่อเลือกรูปใหม่
  }
};

const upload = async () => {
  if (!file.value) return;
console.log('Uploading file:', file.value);
  isLoading.value = true;
  try {
    const res = await checkSlip(file.value);
    // เก็บค่า res ไว้ใน response โดยตรง
    response.value = res;
console.log('Upload Response:', res);
    if (res.success === true) {
        console.log('Success:', res);
      ElMessage.success('ตรวจสอบสลิปเรียบร้อย สลิปถูกต้อง');
    } else {
        console.log('Error:', res);
      ElMessage.error('สลิปไม่ถูกต้อง');
    }
  } catch (err) {
    console.error('Upload Error:', err);
    ElMessage.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  } finally {
    isLoading.value = false;
  }
};
</script>
<style scoped></style>