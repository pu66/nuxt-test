<template>
  <div class="reader-page" @contextmenu.prevent @selectstart.prevent>
    
    <div class="watermark-overlay">
      <span v-for="n in 6" :key="n">CONFIDENTIAL - DO NOT COPY</span>
    </div>

    <el-card shadow="never" class="reader-card">
      <template #header>
        <div class="flex-between">
          <el-button icon="Back" @click="$router.back()">กลับ</el-button>
          <div class="header-info">
            <span class="book-title">{{ readInfo?.book_name || 'กำลังโหลด...' }}</span>
            <div v-if="readInfo?.mode === 'full'" class="expire-badge">
              เช่าแล้ว (เข้าถึงฉบับเต็ม)
            </div>
          </div>
          <el-tag :type="readInfo?.mode === 'full' ? 'success' : 'warning'">
            {{ readInfo?.mode === 'full' ? 'ฉบับเต็ม' : 'ทดลองอ่าน' }}
          </el-tag>
        </div>
      </template>

      <div v-loading="isLoading" class="pdf-container">
        <div 
          v-for="page in totalPagesToShow" 
          :key="page" 
          :id="'page-section-' + page"
          class="pdf-page-wrapper"
        >
          <canvas :id="'pdf-canvas-' + page" class="pdf-canvas"></canvas>
          
          <div class="protection-overlay"></div>
          
          <div class="page-footer">หน้า {{ page }}</div>
        </div>

        <div v-if="isPaywallVisible" class="paywall-section">
          <el-result icon="warning" title="เนื้อหาเพิ่มเติมสำหรับสมาชิก">
            <template #extra>
              <el-button type="primary" size="large">เช่าอ่านต่อเพียง 10 บาท</el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-card>

    <div v-if="!isLoading" class="reader-controls">
      <el-button-group>
        <el-button 
          icon="ArrowLeft" 
          :disabled="currentPage === 1" 
          @click="scrollToPage(currentPage - 1)"
        >ก่อนหน้า</el-button>
        
        <el-button disabled class="page-num-display">
          {{ currentPage }} / {{ totalPagesToShow }}
        </el-button>

        <el-button 
          :disabled="currentPage === totalPagesToShow" 
          @click="scrollToPage(currentPage + 1)"
        >ถัดไป <el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
      </el-button-group>

      <el-select 
        v-model="currentPage" 
        @change="scrollToPage" 
        class="page-select"
        placeholder="ไปที่หน้า"
      >
        <el-option v-for="p in totalPagesToShow" :key="p" :label="'หน้า ' + p" :value="p" />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist';
import { useBook } from '~/composables/api/useBook';
import type { ReadInfoResponse } from '~/models/book/book_res';
import { ElMessage } from 'element-plus';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const route = useRoute();
const { getReadInfo, getPDFData } = useBook();

const isLoading = ref(true);
const readInfo = ref<ReadInfoResponse | null>(null);
const totalPagesToShow = ref(0);
const isPaywallVisible = ref(false);
const currentPage = ref(1);
const observers = ref<IntersectionObserver | null>(null);

const disableShortcuts = (e: KeyboardEvent) => {
  const blockedKeys = ['s', 'p', 'c', 'u'];
  if ((e.ctrlKey || e.metaKey) && blockedKeys.includes(e.key.toLowerCase())) {
    e.preventDefault();
    ElMessage.warning('ไม่อนุญาตให้ดาวน์โหลด พิมพ์ หรือคัดลอกเนื้อหา');
  }
};

// 📍 ระบบเลื่อนหน้า (Smooth Scroll)
const scrollToPage = (pageNo: number) => {
  const element = document.getElementById(`page-section-${pageNo}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    currentPage.value = pageNo;
  }
};

// 📍 ระบบตรวจจับว่าอ่านถึงหน้าไหน (Intersection Observer)
const initPageObserver = () => {
  observers.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        currentPage.value = parseInt(id.split('-').pop() || '1');
      }
    });
  }, { threshold: 0.2 });

  for (let i = 1; i <= totalPagesToShow.value; i++) {
    const el = document.getElementById(`page-section-${i}`);
    if (el) observers.value.observe(el);
  }
};

const renderPDF = async () => {
  const bookId = route.params.id as string;
  try {
    const info = await getReadInfo(bookId);
    readInfo.value = info;

    // ดึงข้อมูลแบบ ArrayBuffer (Raw Data) ป้องกันการเปิด URL ตรงๆ
    const pdfData = await getPDFData(bookId);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const actualTotalPages = pdf.numPages;
    if (info.mode === 'preview' && info.max_pages > 0) {
      totalPagesToShow.value = Math.min(actualTotalPages, info.max_pages);
      isPaywallVisible.value = actualTotalPages > info.max_pages;
    } else {
      totalPagesToShow.value = actualTotalPages;
    }

    isLoading.value = false;

    nextTick(async () => {
      for (let i = 1; i <= totalPagesToShow.value; i++) {
        const page = await pdf.getPage(i);
        const canvas = document.getElementById(`pdf-canvas-${i}`) as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;
        const viewport = page.getViewport({ scale: 1.5 });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

    await page.render({ canvas, viewport }).promise;
      }
      initPageObserver();
    });
  } catch (err) {
    console.error('Error:', err);
    isLoading.value = false;
  }
};

onMounted(() => {
  renderPDF();
  window.addEventListener('keydown', disableShortcuts);
});

onUnmounted(() => {
  window.removeEventListener('keydown', disableShortcuts);
  if (observers.value) observers.value.disconnect();
});
</script>

<style scoped>
.reader-page {
  background-color: #f0f2f5;
  min-height: 100vh;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 20px 0 120px 0; /* เว้นที่ว่างด้านล่างให้ Control Bar */
}

.pdf-page-wrapper {
  position: relative;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border-radius: 4px;
}

.pdf-canvas {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Overlay ใสกันคลิกขวาที่ตัวแคนวาส */
.protection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px; /* เว้นส่วนเลขหน้าข้างล่าง */
  background: transparent;
  z-index: 10;
}

.watermark-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* ให้คลิกทะลุได้ */
  z-index: 999;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 100px;
  opacity: 0.08;
  transform: rotate(-30deg) scale(1.5);
}
.watermark-overlay span {
  font-size: 40px;
  font-weight: bold;
  color: #000;
  white-space: nowrap;
}

/* 🕹️ Sticky Control Bar */
.reader-controls {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 25px;
  border-radius: 50px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  backdrop-filter: blur(8px);
  border: 1px solid #ddd;
}

.page-num-display {
  color: #333 !important;
  font-weight: bold;
  background: transparent !important;
  border: none !important;
}

.page-select {
  width: 110px;
  margin-left: 15px;
}

.expire-badge {
  font-size: 11px;
  color: #67c23a;
  margin-top: 4px;
}

.header-info { text-align: center; }

/* 🖨️ ป้องกันการสั่ง Print */
@media print {
  .reader-page { display: none !important; }
}
</style>