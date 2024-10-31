import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Đảm bảo cấu hình các biến môi trường

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc dịch vụ email khác như 'outlook', 'yahoo', v.v.
  auth: {
    user: process.env.USEREMAIL, // Địa chỉ email lấy từ biến môi trường
    pass: process.env.PASS_APP   // Mật khẩu ứng dụng hoặc mật khẩu email
  }
});

export default transporter;
