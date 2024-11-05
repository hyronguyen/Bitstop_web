let userId;
document.addEventListener('DOMContentLoaded', () => {
    // lấy authToken từ localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        // nếu chưa đăng nhập (không có token)
        window.location.href = 'login.html'; 
    } else {
        console.log('Auth token is present. User is logged in.');
        const decodedToken = jwt_decode(authToken);
        userId = decodedToken.id;
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
    
    document.getElementById('statusbar').innerText = order.status;
    document.getElementById('order_id').innerText = order.id;
    document.getElementById('order_date').innerText = new Date(order.date.seconds * 1000).toLocaleDateString();
    document.getElementById('order_total').innerText = order.subtotal.toLocaleString() + ' VND';
    document.getElementById('order_payment').innerText = order.payment;
    document.getElementById('name').value=order.name;

    // Hiển thị thông tin giao hàng
    document.getElementById('shipping_customer').innerText= order.name;
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

    // Show/Hide buttons based on status
    const cancelButton = document.getElementById('cancel_order_btn');
    const receivedButton = document.getElementById('received_order_btn');

    if (order.status === 'Delivering') {
        cancelButton.style.display = 'none'; // Hide Cancel Order button
        receivedButton.style.display = 'inline-block'; // Show Received button
    } else if (order.status === 'Request') {
        cancelButton.style.display = 'none'; // Hide Cancel Order button
        receivedButton.style.display = 'none'; // Hide Received button
    } else {
        cancelButton.style.display = 'inline-block'; // Show Cancel Order button
        receivedButton.style.display = 'none'; // Hide Received button
    }
    
    document.getElementById('cancel_order_btn').addEventListener('click', handleCancelOrder);
    document.getElementById('received_order_btn').addEventListener('click', handleReceivedOrder);
}


function handleCancelOrder() {
    $('#cancelOrderModal').modal('show');

    // Optionally, you can set the order ID in the hidden input
    document.getElementById("order_id_hidden").value = document.getElementById("order_id").innerText;
}

function handleReceivedOrder() {
    alert("Received button clicked");

}

document.getElementById("ticketForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the data from the form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message= document.getElementById("reason").value; // Get selected reason
    const orderId = document.getElementById("order_id_hidden").value;

    // Check required fields
    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    const ticketData = {
        customerId: userId, // Make sure userId is defined in your context
        customerName: name,
        customerMail: email,
        ticketDescription:`Yêu cầu hủy đơn ${orderId}|` + message,
        orderId: orderId // Include the order ID
    };

    try {
        const response = await apiCreateNewTicket(ticketData); // Implement this function to send the ticket data
        if (response) {
            apiUpdateRequestOrder(orderId);
            alert(response.message);
            $('#cancelOrderModal').modal('hide');
        }
        console.log(ticketData);
    } catch (error) {
        console.error("Error creating ticket:", error);
        alert("An error occurred while creating the ticket.");
    }
});





