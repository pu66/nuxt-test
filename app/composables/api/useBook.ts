import type { ReadInfoResponse } from "~/models/book/book_res";

export function useBook() {
  const { $api } = useNuxtApp();

  // 1. ดึงข้อมูล Metadata (สิทธิ์การอ่าน)
  const getReadInfo = async (bookId: string | number) => {
    const response = await $api.get<ReadInfoResponse>(
      `/books/${bookId}/read-info`
    );
    return response.data;
  };

  // 2. ดึงไฟล์ PDF เป็น ArrayBuffer (เพื่อให้ Authorization Interceptor ทำงาน)
  const getPDFData = async (bookId: string | number) => {
    const response = await $api.get(`/books/${bookId}/stream`, {
      responseType: "arraybuffer", // สำคัญมาก: เพื่อรับข้อมูลเป็นไฟล์ดิบ
    });
    return response.data; // จะได้ข้อมูลเป็น ArrayBuffer
  };

  return {
    getReadInfo,
    getPDFData,
  };
}
