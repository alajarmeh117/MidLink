// src/api/config.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://midlink-of4r.onrender.com", // تأكد من أن هذا الـ URL يتطابق مع عنوان backend
  withCredentials: true, // هذا مهم لإرسال ملفات تعريف الارتباط
});

export default api;
