import { PDFDocument, rgb } from 'pdf-lib';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from '../Configs/firestorage.js'; // Import storage từ cấu hình Firebase

export const createPurchaseInvoice = async (purchaseOrder) => {
    const { pur_ncc, pur_res, pur_items } = purchaseOrder;

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const titleSize = 24;
    const textSize = 12;

    // Invoice title
    page.drawText("DON MUA HANG CUA Bitstop", {
        x: 50,
        y: 370,
        size: titleSize,
        color: rgb(0, 0, 0)
    });

    // Vendor and buyer details in Vietnamese
    page.drawText(`NHA CUNG CAP: ${pur_ncc}`, {
        x: 50,
        y: 330,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    page.drawText(`NGUOI MUA: ${pur_res}`, {
        x: 50,
        y: 310,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Add the purchase order ID (doc ID)
    page.drawText(`MA DON HANG: ${purchaseOrder.pur_invo}`, {
        x: 50,
        y: 290,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Invoice creation date
    const creationDate = new Date().toLocaleString();
    page.drawText(`NGAY TAO DON: ${creationDate}`, {
        x: 50,
        y: 270,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Product list title
    page.drawText("DANH SACH SAN PHAM:", {
        x: 50,
        y: 240,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Drawing columns for product details
    page.drawText("ID", { x: 50, y: 210, size: textSize });
    page.drawText("TEN SAN PHAM", { x: 100, y: 210, size: textSize });
    page.drawText("GIA", { x: 300, y: 210, size: textSize });
    page.drawText("SO LUONG", { x: 450, y: 210, size: textSize });

    // Product data
    let yPosition = 200;
    pur_items.forEach((item) => {
        // Draw product details
        page.drawText(item.item_id, { x: 50, y: yPosition, size: textSize });
        page.drawText(item.item_name, { x: 100, y: yPosition, size: textSize });
        page.drawText(`${item.item_price} VND`, { x: 300, y: yPosition, size: textSize });
        page.drawText(`${item.item_qty}`, { x: 450, y: yPosition, size: textSize });

        // Draw a separating line
        const lineYPosition = yPosition - 5;
        page.drawLine({
            start: { x: 50, y: lineYPosition },
            end: { x: 550, y: lineYPosition },
            thickness: 0.5,
            color: rgb(0, 0, 0),
        });

        yPosition -= 30; // Move down to next line
    });

    // Add signature section for the buyer
    const signatureYPosition = yPosition - 40;
    page.drawText("CHU KY:", {
        x: 50,
        y: signatureYPosition,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    page.drawText("Bitstop's purchase staff", {
        x: 50,
        y: signatureYPosition - 20,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Create PDF file
    const pdfBytes = await pdfDoc.save();

    // Create reference for Firebase Storage
    const fileRef = ref(storage, `Invoice/invoice_${purchaseOrder.pur_invo}_bitstop_huflit.pdf`);

    // Upload the file to Firebase Storage
    try {
        await uploadBytes(fileRef, pdfBytes);
        console.log('Hóa đơn đã được tải lên thành công');

        // Get the file URL from Firebase Storage
        const fileURL = await getDownloadURL(fileRef);

        // Return the URL of the uploaded invoice
        return { fileURL };

    } catch (error) {
        throw new Error(error.message);  // Let the caller handle the error
    }
};

export const createOrderPDF = async (orderData, id) => {
    const { or_cid, or_name, or_address, or_phone, or_items } = orderData;


    const customerName = removeDiacritics(or_name);
    const customerAddress = removeDiacritics(or_address);

    // Tạo file PDF mới
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const titleSize = 24;
    const textSize = 12;
    const idTextSize = 8;  // Cỡ chữ bình thường cho ID

    // Tiêu đề hóa đơn
    page.drawText(`DON HANG CUA ${customerName}`, {
        x: 50,
        y: 370,
        size: titleSize,
        color: rgb(0, 0, 0)
    });

    // Thông tin khách hàng
    page.drawText(`KHACH HANG: ${or_cid}`, {
        x: 50,
        y: 330,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    page.drawText(`DIA CHI: ${customerAddress}`, {
        x: 50,
        y: 310,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    page.drawText(`SO DIEN THOAI: ${or_phone}`, {
        x: 50,
        y: 290,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Mã đơn hàng (ID)
    page.drawText(`MA DON HANG: ${id}`, {
        x: 50,
        y: 270,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Ngày tạo đơn
    const creationDate = new Date().toLocaleString();
    page.drawText(`NGAY TAO DON: ${creationDate}`, {
        x: 50,
        y: 250,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Tiêu đề danh sách sản phẩm
    page.drawText("DANH SACH SAN PHAM:", {
        x: 50,
        y: 220,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Các cột thông tin sản phẩm - tăng khoảng cách
    page.drawText("ID", { x: 50, y: 190, size: textSize });
    page.drawText("TEN SAN PHAM", { x: 150, y: 190, size: textSize });  // Dời cột TEN SAN PHAM xa hơn
    page.drawText("GIA", { x: 350, y: 190, size: textSize });            // Dời cột GIA xa hơn
    page.drawText("SO LUONG", { x: 450, y: 190, size: textSize });

    // Dữ liệu sản phẩm
    let yPosition = 180;

    or_items.forEach((item) => {
        // Hiển thị thông tin chi tiết sản phẩm - các cột đã giãn cách
        page.drawText(item.id, { x: 50, y: yPosition, size: idTextSize });
        page.drawText(item.title, { x: 150, y: yPosition, size: textSize });
        page.drawText(`${item.total} VND`, { x: 350, y: yPosition, size: textSize });
        page.drawText(`${item.quantity}`, { x: 450, y: yPosition, size: textSize });

        // Kẻ đường ngang phân cách
        const lineYPosition = yPosition - 5;
        page.drawLine({
            start: { x: 50, y: lineYPosition },
            end: { x: 550, y: lineYPosition },
            thickness: 0.5,
            color: rgb(0, 0, 0),
        });

        yPosition -= 30; // Di chuyển xuống dòng tiếp theo
    });

    // Phần chữ ký khách hàng
    const signatureYPosition = yPosition - 40;
    page.drawText("CHU KY KHACH HANG:", {
        x: 50,
        y: signatureYPosition,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    page.drawText(`${customerName}`, {
        x: 50,
        y: signatureYPosition - 20,
        size: textSize,
        color: rgb(0, 0, 0)
    });

    // Tạo file PDF
    const pdfBytes = await pdfDoc.save();

    // Tạo tham chiếu đến Firebase Storage
    const fileRef = ref(storage, `Order/invoice_order_${id}_bitstop.pdf`);

    // Upload file lên Firebase Storage
    try {
        await uploadBytes(fileRef, pdfBytes);
        console.log('Hóa đơn đã được tải lên thành công');

        // Lấy URL của file PDF
        const fileURL = await getDownloadURL(fileRef);

        // Trả về URL của hóa đơn đã tải lên
        return { fileURL };

    } catch (error) {
        throw new Error(error.message);
    }
};

const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};



