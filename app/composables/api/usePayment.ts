import type { QRResponse } from "~/models/payment/respone/qr_res";

export function usePayment() {
  const { $api } = useNuxtApp();

  const generateQR = async (amount: number): Promise<QRResponse> => {
    try {
      const response = await $api.post<QRResponse>("/payment/generate-qrcode", {
        amount: amount,
      });

      return response.data;
    } catch (error: any) {
      console.error("Generate QR Error:", error);
      return {
        RespCode: "500",
        RespMessage: error.message || "Internal Server Error",
        data: "",
      };
    }
  };

  return {
    generateQR,
  };
}
