import type { QRResponse } from "~/models/payment/respone/qr_res";

export function usePayment() {
  const { $api } = useNuxtApp();
  // 1. เพิ่มฟังก์ชันสร้าง Order (ใหม่)
  const createRental = async (payload: {
    member_id: number;
    total_price: number;
    rent_ids: number[];
    rent_days: number[];
  }) => {
    try {
      const response = await $api.post("/payment/create-rental", payload);
      return response.data; // จะได้ { RespCode: "200", data: { order_id: 10, ... } }
    } catch (error: any) {
      console.error("Create Rental Error:", error);
      throw error;
    }
  };
  const generateQR = async (
    amount: number,
    orderId: number
  ): Promise<QRResponse> => {
    try {
      const response = await $api.post<QRResponse>("/payment/generate-qrcode", {
        amount: amount,
        order_id: orderId,
      });

      return response.data;
    } catch (error: any) {
      console.error("Generate QR Error:", error);
      return {
        RespCode: "500",
        RespMessage:
          error.response?._data?.RespMessage || "Internal Server Error",
        data: "",
      };
    }
  };

  return {
    createRental,
    generateQR,
  };
}
