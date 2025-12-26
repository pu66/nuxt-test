<template>
    <div>
        <h1>Upload</h1>
        <input type="file" @change="handleFileChange"/>
        <el-button @click="upload" type="primary">Upload</el-button>
        <div v-if="response">
            <h2>Response</h2>
            <p>{{ response.project_id }}</p>
            <p>{{ response.filename }}</p>
            <p>{{ response.createAt }}</p>
            <p>{{ response.thumbnail }}</p>
            <img :src="`https://csmsu.net:3443/cdn/x/${response.filename}`" alt="Filename" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUpload } from '~/composables/api/useUpload';
import type { UploadPostResponse } from '~/models/upload/response/upload_post_res';

let file = ref<File>();
let response = ref<UploadPostResponse>();
function handleFileChange(event: Event) {
    file.value = (event.target as HTMLInputElement).files?.[0];
    console.log(file.value);
}

definePageMeta({
    layout: 'trip'
})

const { uploadFile } = useUpload();

async function upload() {
    if (!file.value) {
        ElMessage.error('No file selected');
        return;
    }else{
        response.value = await uploadFile(file.value);
        ElMessage.success('File uploaded successfully');
    }
}
</script>

<style scoped>

</style>