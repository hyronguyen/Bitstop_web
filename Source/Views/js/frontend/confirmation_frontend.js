document.addEventListener('DOMContentLoaded', () => {
    // lấy authToken từ localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        // nếu chưa đăng nhập (không có token)
        window.location.href = 'login.html'; 
    } else {
        console.log('Auth token is present. User is logged in.');
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');

        LoadMyOrder(orderId);
    }
});

async function LoadMyOrder(orderId) {
    try {
        const response = await apigetOrdersById(orderId);

        // Xử lý đối tượng đơn hàng (không cần map vì đây là đối tượng đơn lẻ)
        const order = {
            id: response.id,                   // Identify
            address: response.or_address,      // Địa chỉ giao hàng
            status: response.or_status,        // Trạng thái đơn hàng
            items: response.or_items,          // Danh sách sản phẩm
            payment: response.or_payment,      // Phương thức thanh toán
            subtotal: response.or_subtotal,    // Tổng tiền
            phone: response.or_phone,          // Số điện thoại người nhận
            name: response.or_name,            // Tên người nhận
            or_invo: response.or_invo,         // Liên kết hóa đơn
            date: response.or_date             // Ngày đặt hàng
        };

        displayOrderDetails(order);
    } catch (error) {
        console.error("Error loading order:", error);
        return null;
    }
}

function displayOrderDetails(order) {
    // Hiển thị thông tin đơn hàng
    document.getElementById('order_id').innerText = order.id;
    document.getElementById('order_date').innerText = new Date(order.date.seconds * 1000).toLocaleDateString();
    document.getElementById('order_total').innerText = order.subtotal.toLocaleString() + ' VND';
    document.getElementById('order_payment').innerText = order.payment;

    // Hiển thị thông tin giao hàng
    document.getElementById('shipping_address').innerText = order.address;
    document.getElementById('shipping_phone').innerText = order.phone;

    // Hiển thị danh sách sản phẩm
    const orderItemsContainer = document.getElementById('order_items');
    orderItemsContainer.innerHTML = ''; // Xóa nội dung cũ

    order.items.forEach(item => {
        const itemRow = document.createElement('tr');
        itemRow.innerHTML = `
            <td><p>${item.title}</p></td>
            <td><h5>x ${item.quantity}</h5></td>
            <td><p>${item.total.toLocaleString()} VND</p></td>
        `;
        orderItemsContainer.appendChild(itemRow);
    });

    // Hiển thị tổng tiền và tổng cộng
    document.getElementById('order_subtotal').innerText = order.subtotal.toLocaleString() + ' VND';
    document.getElementById('order_final_total').innerText = (order.subtotal + 50000).toLocaleString() + ' VND'; // Bao gồm phí vận chuyển
    
}

