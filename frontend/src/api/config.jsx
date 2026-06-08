// src/api/config.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // تأكد من أن هذا الـ URL يتطابق مع عنوان backend
  withCredentials: true, // هذا مهم لإرسال ملفات تعريف الارتباط
});

export default api;
