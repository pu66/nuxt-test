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
  const checkSlip = async (file: File): Promise<SlipPostResponse> => {
    const formData = new FormData();
    formData.append("files", file);

    return await $fetch<SlipPostResponse>("/api/slipok", {
      method: "POST",
      body: formData,
    });
  };

  return { checkSlip };
}
