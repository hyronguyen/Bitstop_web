document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        const decodedToken = jwt_decode(authToken);
        userId = decodedToken.id;
        console.log(userId);

        LoadMyOrder(userId);
    }
});

async function LoadMyOrder(userId){
try{
    const response = await apigetOrdersByCustomerId(userId);

    const orders = response.map(orderData => new Order(
        orderData.id, 
        orderData.or_cid,
        orderData.or_name,
        orderData.or_address,
        orderData.or_phone,
        orderData.or_subtotal,
        orderData.or_items,
        orderData.or_date,
        orderData.or_status,
        orderData.or_payment
    ));

    displayOrders(orders);

}
catch(error){
console.log(error)
}
}

function displayOrders(orders) {
    const orderListContainer = document.querySelector('.order-list');
    
    // Clear any existing content
    orderListContainer.innerHTML = '';

    orders.forEach(order => {
        // Create the order card structure
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item', 'card', 'mb-4', 'shadow-sm');

        const orderHeader = document.createElement('div');
        orderHeader.classList.add('card-header');
        orderHeader.innerHTML = `
            <h5 class="card-title">Order: #${order.id}</h5>
            <span class="badge ${getOrderStatusBadge(order.status)}">${order.status}</span>
        `;

        const orderBody = document.createElement('div');
        orderBody.classList.add('card-body');
        orderBody.innerHTML = `
            <p><strong>Recipient Name:</strong> ${order.c_name}</p>
            <p><strong>Payment Method:</strong> ${order.payment}</p>
            <p><strong>Delivery Address:</strong> ${order.c_address}</p>
            <p><strong>Total Amount:</strong> ${order.subtotal.toLocaleString()} VND</p>
            <p><strong>Products:</strong></p>
        `;

        // Create the list of products
        const productList = document.createElement('ul');
        productList.classList.add('list-group', 'mb-3');

        order.items.forEach(item => {
            const productItem = document.createElement('li');
            productItem.classList.add('list-group-item');
            productItem.innerText = `${item.title} - ${item.total.toLocaleString()} VND`;
            productList.appendChild(productItem);
        });

        // Append product list and the View Details button
        orderBody.appendChild(productList);
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.classList.add('btn', 'btn-primary');
        viewDetailsButton.innerText = 'View Details';
        orderBody.appendChild(viewDetailsButton);

        // Append header and body to the order card
        orderItem.appendChild(orderHeader);
        orderItem.appendChild(orderBody);

        // Append the order card to the container
        orderListContainer.appendChild(orderItem);
    });
}


function getOrderStatusBadge(status) {
    switch (status.toLowerCase()) {
        case 'succeeded':
            return 'bg-success';
        case 'processing':
            return 'bg-warning';
        case 'delivering':
            return 'bg-info';
        case 'failed':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}
