// import axios from "axios";
// import FormData from "form-data";

// export default defineEventHandler(async (event) => {
//   const body = await readMultipartFormData(event);

//   if (!body || !body[0]?.data) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: "No file uploaded",
//     });
//   }

//   const file = body[0];

//   const form = new FormData();
//   form.append("files", file.data, {
//     filename: file.filename,
//     contentType: file.type,
//   });

//   const res = await axios.post(
//     "https://api.slipok.com/api/line/apikey/58218",
//     form,
//     {
//       headers: {
//         "x-authorization": "SLIPOKZATHNL5",
//         ...form.getHeaders(), // ✅ ใช้ได้ เพราะอยู่ฝั่ง server
//       },
//       maxBodyLength: Infinity,
//     }
//   );

//   return res.data;
// });
// export default defineEventHandler((event) => {
//   return {
//     ok: true,
//     method: event.method,
//   };
// });
