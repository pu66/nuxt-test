export interface QRResponse {
  RespCode: string;
  RespMessage: string;
  data: string; // เก็บ Base64 String ของรูปภาพ
}
