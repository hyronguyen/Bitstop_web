import transporter from "../Middleware/nodemailer.js";

// Hàm gửi email
export const sendMail = async (req, res) => {
  const { to, subject, text, html, infoforcheckout } = req.body; // Lấy thông tin từ yêu cầu

  try {
    // Cấu hình nội dung email
    const mailOptions = {
      from: process.env.USEREMAIL, // Địa chỉ gửi email từ .env
      to: to,                      // Địa chỉ người nhận
      subject: subject,            // Tiêu đề email
      text: text,                  // Nội dung văn bản của email (tuỳ chọn)
      html: html || `<p>${infoforcheckout}</p>`, // Nội dung HTML của email, có thể tùy chọn sử dụng infoforcheckout
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    // Phản hồi khi thành công
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    // Phản hồi khi gặp lỗi
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

export default { sendMail };
