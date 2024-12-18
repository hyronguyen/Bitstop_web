
let orders = [];

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        console.log('Auth token is present. User is logged in.');
        LoadOrder();
        
    }
});

async function LoadOrder() {
    const response = await apiGetOrders();
    orders = response;
    renderOrders(orders);
}   
document.getElementById('request-tab').addEventListener('click', loadTickets);

document.getElementById('list-coupon-tab').addEventListener('click', renderCoupons);

// renderCoupons.js
async function renderCoupons() {
    const coupons = await apiGetCoupons();
    try{
    const couponsList = document.getElementById('coupons-list'); // Ensure this ID matches your HTML
    couponsList.innerHTML = ''; // Clear any existing content

    if (coupons.length === 0) {
        console.log("No coupons available to display."); // Log if no coupons
    }

    coupons.forEach((coupon, index) => {
        const couponRow = `
            <tr>
                <td>${index + 1}</td>
                <td>${coupon.cou_id}</td>
                <td>${new Date(coupon.cou_exp).toLocaleDateString()}</td>
                <td>${coupon.cou_discount}</td> 
                <td>${coupon.cou_status}</td>
                <td>${coupon.cou_user}</td>
            </tr>
        `;
        couponsList.insertAdjacentHTML('beforeend', couponRow);
    });}
    catch(error){
        console.log(error);
    }
}

// Function to render orders in the HTML table
function renderOrders(ordersData) {
    orders = ordersData; // Assign the incoming data to the global orders array
    const orderListElement = document.getElementById('order-list');
    orderListElement.innerHTML = ''; // Clear existing rows

    orders.forEach((order, index) => {
        const subtotal = (order.or_subtotal || 0).toLocaleString() + ' VND';
        const date = order.or_date ? new Date(order.or_date).toLocaleString() : 'No Date Available';
        const statusBadgeClass = getOrderStatusBadge(order.or_status);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.or_name || 'N/A'}</td>
            <td>${date}</td>
            <td>${subtotal}</td>
            <td>${order.or_payment || 'N/A'}</td>
            <td><span class="badge ${statusBadgeClass}">${order.or_status}</span></td>
            <td>
                <a href="${order.or_invo || '#'}" target="_blank" class="btn btn-link">View Invoice</a>
            </td>
            <td>
                <button class="btn btn-primary" onclick="viewOrderDetails(${index})"><i class="fa-solid fa-eye"></i></button>
            </td>
        `;
        orderListElement.appendChild(row);
    });
}

// Function to view order details
function viewOrderDetails(index) {
    const order = orders[index]; // Get the specific order from the orders array

    if (!order) {
        console.error('Invalid order index:', index);
        return; // Exit if the order is not found
    }

    // Populate the modal fields with order data
    document.getElementById('or_name').value = order.or_name || 'N/A';
    document.getElementById('or_date').value = order.or_date ? new Date(order.or_date).toLocaleString() : 'No Date Available';
    document.getElementById('or_subtotal').value = (order.or_subtotal || 0).toLocaleString() + ' VND';
    document.getElementById('or_payment').value = order.or_payment || 'N/A';
    document.getElementById('or_status').value = order.or_status || 'N/A';
    document.getElementById('or_invo').value = order.or_invo || 'N/A';

    // Clear existing order items in the modal
    const orderItemsContainer = document.getElementById('or_items_container');
    orderItemsContainer.innerHTML = ''; // Clear previous items

    // Populate the items in the order
    if (order.or_items && order.or_items.length > 0) {
        order.or_items.forEach(item => {
            const itemCard = `
                <div class="card mb-2 border-secondary">
                    <div class="card-body">
                        <h6 class="card-title">Item Title: ${item.title}</h6>
                        <p class="card-text"><strong>Price:</strong> ${(item.total || 0).toLocaleString()} VND</p>
                        <p class="card-text"><strong>Quantity:</strong> ${item.quantity}</p>
                    </div>
                </div>
            `;
            orderItemsContainer.insertAdjacentHTML('beforeend', itemCard); // Append item details
        });
    } else {
        const noItemsMessage = `
            <p class="text-muted">No items in this order.</p>
        `;
        orderItemsContainer.insertAdjacentHTML('beforeend', noItemsMessage); // Show message if no items
    }

    // Display the modal
    const orderDetailsModal = new bootstrap.Modal(document.getElementById('order-details-modal'));
    orderDetailsModal.show();
}


// Function to toggle user input field based on selection
function toggleUserInput() {
    const userType = document.getElementById('userType').value;
    const couponUser = document.getElementById('couponUser');
    
    if (userType === 'specific') {
        couponUser.disabled = false;
        couponUser.placeholder = 'Enter User ID';
    } else {
        couponUser.disabled = true;
        couponUser.value = ''; // Clear the field if "All Users" is selected
        couponUser.placeholder = 'User ID Disabled';
    }
}

async function addCoupon() {
    const couponExp = document.getElementById('couponExp').value;
    const couponDiscount = document.getElementById('couponDiscount').value;
    const userType = document.getElementById('userType').value;
    const couponUser = userType === 'specific' ? document.getElementById('couponUser').value : null;

    // Add '%' to the coupon discount
    const couponDiscountWithPercentage = couponDiscount + '%';

    // Prepare the coupon data
    const couponData = {
        cou_exp: couponExp,
        cou_discount: couponDiscountWithPercentage, // Use the discount with '%'
        cou_user: couponUser,
        cou_status: 'available' // Set default status or modify as needed
    };

    try {
        // Call the API to add the coupon
        await apiAddCoupon(couponData);

        // Show success notification
        alert('Coupon added successfully!');
        // Optionally, reset the form or show success in a specific HTML element
        document.getElementById('couponForm').reset(); // Reset the form if needed
    } catch (error) {
        console.error('Error adding coupon:', error);
    }
}
//#region Ticket
// Hàm mở modal

async function loadTickets() {
    const tickets = await apiGetAllTickets(); // Gọi API để lấy dữ liệu
    const ticketListContainer = document.getElementById('ticket_list');
    ticketListContainer.innerHTML = ''; // Xóa nội dung cũ

    tickets.forEach(ticket => {

        const descriptionParts = ticket.tic_des.split('|');
         const firstDescription = descriptionParts[0]; // Lấy phần đầu tiên

        const ticketRow = document.createElement('tr');
        ticketRow.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.tic_name}</td>
            <td>${new Date(ticket.tic_date.seconds * 1000).toLocaleDateString()}</td>
            <td>${firstDescription}</td>
            <td>${ticket.tic_status}</td>
            <td>
                <button class="btn btn-primary" onclick="openModal('${ticket.id}', '${ticket.tic_name}', '${ticket.tic_des}', '${ticket.tic_mail}', '${ticket.tic_order}', '${new Date(ticket.tic_date.seconds * 1000).toLocaleDateString()}', '${ticket.tic_user}')">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        `;
        ticketListContainer.appendChild(ticketRow);
    });
}

//Xem chi tiết
function openModal(ticketId, ticketName, ticketDes, ticketMail, ticketOrder, ticketDate, ticketUserId) {
    document.getElementById('modalTicketId').textContent = ticketId; // Order ID
    document.getElementById('modalName').textContent = ticketName; // Name
    document.getElementById('modalDescription').textContent = ticketDes; // Description
    document.getElementById('modalEmail').textContent = ticketMail; // Email
    document.getElementById('modalOrder').textContent = ticketOrder; // Status
    document.getElementById('modalDate').textContent = ticketDate; // Date
    document.getElementById('modalUserId').textContent = ticketUserId; // User ID

    // Mở modal
    $('#ticketModal').modal('show');
}

// xử lý phiếu
document.getElementById('doneButton').addEventListener('click', function() {


    const order =  document.getElementById('modalOrder').textContent;
    const mail = document.getElementById('modalEmail').textContent;
    const ticketid=  document.getElementById('modalTicketId').textContent;
    const c_name =  document.getElementById('modalName').textContent;
    const sendmessage = document.getElementById('messageInput').value;

    const html = `<h1>Xin chào ${c_name},</h1>
    <h3>Cảm ơn bạn liên hệ với Bitstop. Đây là thông tin phản hồi của chúng tôi dành cho bạn:</h3>
    <p>${sendmessage}</p>`;


    const subject = "Phản hồi Ticket: "+ ticketid;
  
    if (order!="No Order"){
        apiUpdateCancelOrder(order);
        SendMail("hothanhgiang123@yopmail.com",subject,"",html);
        apiUpdateTicketStatusToDone(ticketid);
    }
    else {
        SendMail("hothanhgiang123@yopmail.com",subject,"",html);
        apiUpdateTicketStatusToDone(ticketid);
    } 
    alert('Ticket marked as done!');

    window.location.reload();
    $('#ticketModal').modal('hide');
    
});
//#endregion

async function SendMail(to,subject,text,html) {
    try{
        await apiSendMail(to, subject, text,html)
    }
    catch(error){
        console.log(error);
    }
}



function getOrderStatusBadge(status) {
    switch (status.toLowerCase()) {
        case 'done':
            return 'bg-success';
        case 'processing':
            return 'bg-warning';
            case 'canceled':
            return 'bg-danger';
            case 'delivering':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
    }
