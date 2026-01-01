export interface ReadInfoResponse {
  allowed: boolean;
  book_id: number;
  book_name: string;
  max_pages: number; // 0 หมายถึงอ่านได้ทั้งหมด
  mode: string; // "preview" หรือ "full"
  expires_at?: string;
}
