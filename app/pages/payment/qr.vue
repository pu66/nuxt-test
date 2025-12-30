<script setup lang="ts">
import { ref, onUnmounted, computed } from "vue";
import { usePayment } from "~/composables/api/usePayment";
import { useSlipOk } from "~/composables/api/useSlipOk";
import type { SlipPostResponse } from "~/models/slip/slip_res";
import { ElMessage } from "element-plus";

const { createRental, generateQR } = usePayment();
const { checkSlip } = useSlipOk();

// QR Generation States
const amount = ref<number | null>(null);
const orderId = ref<number | null>(null);
const qrImage = ref<string>("");
const isLoadingQR = ref(false);

// Slip Check States
const file = ref<File | null>(null);
const imagePreview = ref<string>("");
const response = ref<SlipPostResponse | null>(null);
const isLoadingSlip = ref(false);

// Timer States
const timeLeft = ref(0);
const timerId = ref<NodeJS.Timeout | null>(null);
const isExpired = ref(false);

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const startTimer = () => {
  if (timerId.value) clearInterval(timerId.value);
  isExpired.value = false;
  timeLeft.value = 3600;

  timerId.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      expireQR();
    }
  }, 1000);
};

const expireQR = () => {
  if (timerId.value) clearInterval(timerId.value);
  isExpired.value = true;
  qrImage.value = "";
  ElMessage.error("QR Code หมดอายุแล้ว กรุณาสร้างใหม่");
};

onUnmounted(() => {
  if (timerId.value) clearInterval(timerId.value);
});

definePageMeta({
  layout: 'trip'
});

// Generate QR Function
async function onGenerate() {
  if (!amount.value || amount.value <= 0) {
    ElMessage.warning("กรุณากรอกจำนวนเงินที่ถูกต้อง");
    return;
  }

  isLoadingQR.value = true;
  try {
    const orderRes = await createRental({
      member_id: 1,
      total_price: amount.value,
      rent_ids: [1],
      rent_days: [7]
    });

    if (orderRes.RespCode === "200") {
      orderId.value = orderRes.data.order_id;
      const result = await generateQR(amount.value, orderId.value!);

      if (result.RespCode === "200") {
        qrImage.value = result.data;
        ElMessage.success("สร้างรายการเช่าและ QR Code สำเร็จ");
        startTimer();
      } else {
        ElMessage.error(result.RespMessage || "เกิดข้อผิดพลาดในการสร้าง QR Code");
      }
    } else {
      ElMessage.error(orderRes.RespMessage || "ไม่สามารถสร้าง Order ได้");
    }
  } catch (err: any) {
    console.error(err);
    ElMessage.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    isLoadingQR.value = false;
  }
}

const downloadQR = () => {
  if (!qrImage.value) return;
  const link = document.createElement("a");
  link.href = qrImage.value;
  link.download = `promptpay-order-${orderId.value}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  ElMessage.success("ดาวน์โหลด QR Code เรียบร้อยแล้ว");
};

// Slip Check Functions
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    file.value = target.files[0];
    imagePreview.value = URL.createObjectURL(file.value);
    response.value = null;
  }
};

const uploadSlip = async () => {
  if (!file.value) return;

  isLoadingSlip.value = true;
  try {
    const res = await checkSlip(file.value);
    response.value = res;

    if (res.success === true) {
      ElMessage.success("ตรวจสอบสลิปสำเร็จ - สลิปถูกต้อง");
    } else {
      // แสดงข้อความที่เหมาะสมตามสถานะที่ได้รับ
      const errorMsg = res.message || "ไม่สามารถตรวจสอบสลิปได้";
      if (errorMsg.includes("Network")) {
        ElMessage.error("ไม่สามารถเชื่อมต่อกับระบบตรวจสอบสลิปได้ กรุณาลองใหม่อีกครั้ง");
      } else {
        ElMessage.error(`การตรวจสอบล้มเหลว: ${errorMsg}`);
      }
    }
  } catch (err) {
    console.error("Upload Error:", err);
    ElMessage.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    // response.value = {
    //   success: false,
    //     message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'
    // };
  } finally {
    isLoadingSlip.value = false;
  }
};
</script>

<template>
  <div class="payment-container">
    <!-- QR Generation Section -->
    <el-card class="qr-card mb-6">
      <template #header>
        <h2 class="text-center">ชำระเงินผ่าน PromptPay</h2>
      </template>

      <el-form @submit.prevent="onGenerate" label-position="top">
        <el-form-item label="จำนวนเงิน (บาท)">
          <el-input-number 
            v-model="amount" 
            :min="0.01" 
            :precision="2" 
            class="w-full"
            placeholder="0.00"
            :disabled="qrImage !== '' && !isExpired" 
          />
        </el-form-item>

        <el-button 
          type="primary" 
          class="w-full mt-4" 
          @click="onGenerate" 
          :loading="isLoadingQR"
          :disabled="qrImage !== '' && !isExpired"
        >
          {{ qrImage ? 'สร้าง QR ใหม่' : 'สร้าง QR Code สำหรับชำระเงิน' }}
        </el-button>
      </el-form>

      <div v-if="qrImage || isExpired" class="qr-display">
        <el-divider>สถานะการชำระเงิน</el-divider>
        
        <div v-if="!isExpired" class="timer-box">
          <p class="text-sm">กรุณาชำระเงินภายใน</p>
          <h3 class="countdown-text">{{ formattedTime }}</h3>
        </div>

        <div v-if="!isExpired" class="qr-wrapper">
          <img :src="qrImage" alt="PromptPay QR Code" class="qr-img" />
          <p class="text-center mt-2">ชื่อบัญชี: การติมา คำภีร์</p>
          <p class="text-center">เบอร์พร้อมเพย์: 099-236-7715</p>
        </div>

        <div v-else class="expired-box">
          <el-result
            icon="error"
            title="หมดอายุ"
            sub-title="QR Code นี้ไม่สามารถใช้งานได้แล้ว"
          >
            <template #extra>
              <el-button type="primary" @click="qrImage = ''; isExpired = false;">ตกลง</el-button>
            </template>
          </el-result>
        </div>

        <div class="mt-4 flex justify-center gap-2">
          <el-button v-if="qrImage" type="success" @click="downloadQR" icon="Download">
            บันทึกรูปภาพ
          </el-button>
        </div>
        
        <p v-if="!isExpired" class="text-center text-sm text-gray-500 mt-2">
          เลขที่ออเดอร์: <strong>{{ orderId }}</strong> <br>
          ยอดเงิน: <strong>{{ amount?.toLocaleString() }}</strong> บาท
        </p>
      </div>
    </el-card>

    <!-- Slip Check Section -->
    <el-card class="upload-card">
      <template #header>
        <h2 class="text-center">ตรวจสอบสลิป (SlipOk)</h2>
      </template>

      <div class="form-group">
        <label class="block mb-2 text-sm font-bold">เลือกไฟล์สลิป</label>
        <input 
          type="file" 
          @change="handleFileChange" 
          accept="image/*" 
          class="file-input mb-4" 
        />
        
        <div v-if="imagePreview" class="preview-wrapper">
          <img :src="imagePreview" class="preview-img" />
        </div>

        <el-button 
          type="primary" 
          @click="uploadSlip" 
          :loading="isLoadingSlip" 
          :disabled="!file"
          class="w-full"
        >
          ตรวจสอบทันที
        </el-button>
      </div>

      <div v-if="response">
        <el-divider />
        
        <div :class="['status-header', response.success ? 'success' : 'error']">
          <el-icon v-if="response.success" class="status-icon"><CircleCheckFilled /></el-icon>
          <el-icon v-else class="status-icon"><CircleCloseFilled /></el-icon>
          {{ response.success ? 'ตรวจสอบสำเร็จ - สลิปถูกต้อง' : 'การตรวจสอบล้มเหลว' }}
        </div>

        <div v-if="!response.success" class="error-message">
          <p>{{  'ไม่สามารถตรวจสอบสลิปได้' }}</p>
        </div>

        <details class="mt-4">
          <summary class="text-xs cursor-pointer text-gray-400 hover:text-gray-600">
            ดูข้อมูล JSON ทั้งหมด
          </summary>
          <pre class="json-box">{{ JSON.stringify(response, null, 2) }}</pre>
        </details>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.payment-container {
  max-width: 500px;
  margin: 30px auto;
  padding: 0 20px;
}

.qr-card, .upload-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.mb-6 {
  margin-bottom: 24px;
}

.qr-display {
  margin-top: 20px;
  text-align: center;
}

.timer-box {
  margin-bottom: 15px;
  color: #f56c6c;
}

.countdown-text {
  font-size: 2rem;
  font-weight: bold;
  margin: 5px 0;
}

.qr-wrapper {
  background: white;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  display: inline-block;
}

.qr-img {
  width: 250px;
  height: 250px;
  display: block;
}

.expired-box {
  padding: 20px;
  background: #fef0f0;
  border-radius: 8px;
}

.file-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.file-input:hover {
  border-color: #409eff;
}

.preview-wrapper {
  text-align: center;
  margin: 15px 0;
}

.preview-img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.status-header.success {
  background: #f0f9ff;
  color: #67c23a;
  border: 1px solid #b3e19d;
}

.status-header.error {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fab6b6;
}

.status-icon {
  font-size: 1.5rem;
}

.error-message {
  padding: 12px;
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
  margin-bottom: 10px;
}

.error-message p {
  margin: 0;
  color: #e65100;
  font-size: 0.9rem;
}

.json-box {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  overflow-x: auto;
  margin-top: 8px;
  border: 1px solid #e0e0e0;
  color: #333;
}

.w-full {
  width: 100%;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 8px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.block {
  display: block;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.font-bold {
  font-weight: bold;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.hover\:text-gray-600:hover {
  color: #4b5563;
}

.cursor-pointer {
  cursor: pointer;
}
</style>