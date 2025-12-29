// import axios from "axios";
// import type { SlipPostResponse } from "~/models/slip/slip_res";

// export function useSlip() {
//   const checkSlip = async (file: File): Promise<SlipPostResponse> => {
//     const formData = new FormData();
//     formData.append("files", file);

//     let res = await axios.post(
//       "https://api.slipok.com/api/line/apikey/58218",
//       formData,
//       {
//         headers: {
//           "x-authorization": "SLIPOKZATHNL5",
//         },
//       }
//     );

//     return res.data as SlipPostResponse;
//   };

//   return {
//     checkSlip,
//   };
// }
import type { SlipPostResponse } from "~/models/slip/slip_res";

export function useSlipOk() {
  const { $api } = useNuxtApp(); // ใช้ $api instance ที่คุณมี (ซึ่งชี้ไปที่ Go port 8080)

  const checkSlip = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await $api.post("/payment/verify-slip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: response.data.RespCode === "200",
        message: response.data.RespMessage,
        ...response.data,
      };
    } catch (error) {
      return { success: false, message: "Network Error" };
    }
  };

  return { checkSlip };
}
