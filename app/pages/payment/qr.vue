<script setup lang="ts">
import { ref, onUnmounted, computed } from "vue";
import { usePayment } from "~/composables/api/usePayment";
import { ElMessage } from "element-plus";

const { generateQR } = usePayment();
const amount = ref<number | null>(null);
const qrImage = ref<string>("");
const isLoading = ref(false);

// --- ระบบนับถอยหลัง ---
const timeLeft = ref(0); // เวลาคงเหลือในหน่วยวินาที
const timerId = ref<NodeJS.Timeout | null>(null);
const isExpired = ref(false);

// แปลงวินาทีเป็นรูปแบบ mm:ss
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// ฟังก์ชันเริ่มนับถอยหลัง
const startTimer = () => {
  // ล้าง Timer เก่าถ้ามี
  if (timerId.value) clearInterval(timerId.value);
  
  isExpired.value = false;
  timeLeft.value = 3600; // ตั้งไว้ 1 ชั่วโมง (3600 วินาที)

  timerId.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      expireQR();
    }
  }, 1000);
};

// เมื่อหมดเวลา
const expireQR = () => {
  if (timerId.value) clearInterval(timerId.value);
  isExpired.value = true;
  qrImage.value = ""; // ลบรูป QR ออกเพื่อไม่ให้สแกนได้
  ElMessage.error("QR Code หมดอายุแล้ว กรุณาสร้างใหม่");
};

// ล้าง Timer เมื่อย้ายหน้า
onUnmounted(() => {
  if (timerId.value) clearInterval(timerId.value);
});

definePageMeta({
  layout: 'trip'
});

async function onGenerate() {
  if (!amount.value || amount.value <= 0) {
    ElMessage.warning("กรุณากรอกจำนวนเงินที่ถูกต้อง");
    return;
  }

  isLoading.value = true;
  try {
    const result = await generateQR(amount.value);

    if (result.RespCode === "200") {
      qrImage.value = result.data;
      ElMessage.success("สร้าง QR Code สำเร็จ");
      startTimer(); // เริ่มนับถอยหลังทันทีที่สร้างสำเร็จ
    } else {
      ElMessage.error(result.RespMessage || "เกิดข้อผิดพลาด");
    }
  } catch (err) {
    ElMessage.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    isLoading.value = false;
  }
}
const downloadQR = () => {
  if (!qrImage.value) return;
  
  const link = document.createElement("a");
  link.href = qrImage.value;
  link.download = `promptpay-amount-${amount.value}.png`; // ตั้งชื่อไฟล์
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  ElMessage.success("ดาวน์โหลด QR Code เรียบร้อยแล้ว");
};
</script>

<template>
  <div class="payment-container">
    <el-card class="qr-card">
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
          :loading="isLoading"
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
      <el-button type="success" @click="downloadQR" icon="Download">
        บันทึกรูปภาพ
      </el-button>
    </div>
        <p v-if="!isExpired" class="text-center text-sm text-gray-500 mt-2">
          ยอดเงิน: <strong>{{ amount?.toLocaleString() }}</strong> บาท
        </p>
      </div>
      <p class="text-center text-sm text-gray-500 mt-4">
      * เมื่อชำระเงินสำเร็จ แนปสลิประบบจะตรวจสอบสลิปอัตโนมัติ<br/>
      * โปรดอย่าใช้รูปนี้สแกนซ้ำหากโอนเงินสำเร็จแล้ว
    </p>
    </el-card>
  </div>
</template>

<style scoped>
.payment-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 0 20px;
}

.qr-card {
  border-radius: 12px;
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

.w-full {
  width: 100%;
}

.text-center {
  text-align: center;
}
</style>