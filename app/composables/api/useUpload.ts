import axios from "axios";

import type { UploadPostResponse } from "~/models/upload/response/upload_post_res";

export function useUpload() {
  const uploadFile = async (file: File): Promise<UploadPostResponse> => {
    const formData = new FormData();
    formData.append("file", file); // key = 'file' ต้องตรงกับฝั่ง server

    let res = await axios.post("https://csmsu.net:3443/cdn/x", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let data = res.data as UploadPostResponse;
    return data;
  };

  // Export functions
  return {
    uploadFile,
  };
}
