document.addEventListener('DOMContentLoaded', () => {
    // Fetch inforCheckout from local storage
    const inforCheckout = JSON.parse(localStorage.getItem('inforCheckout'));

    // Check if inforCheckout is available
    if (inforCheckout) {
        // Get elements to update
        const orderItemsList = document.getElementById('orderItemsList');
        const subtotalDisplay = document.getElementById('subtotalDisplay');
        const totalDisplay = document.getElementById('totalDisplay');

        // Ensure elements are found before updating them
        if (orderItemsList && subtotalDisplay && totalDisplay) {
    

            // Populate order items
            inforCheckout.items.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.innerHTML = `<a href="#">${capitalizeEachWord(item.title)} <span class="middle">x ${item.quantity}</span> <span class="last">${formatNumberWithCommas(item.total)} VND</span></a>`;
                orderItemsList.appendChild(itemElement);
            });

            // Display subtotal
            subtotalDisplay.innerText = formatNumberWithCommas(inforCheckout.subtotal) + ' VND';

            // Calculate total including shipping
            const shippingCost = 30000; // Flat rate shipping cost
            const total = inforCheckout.subtotal + shippingCost;
            totalDisplay.innerText = formatNumberWithCommas(total) + ' VND';
        } else {
            console.error('One or more elements not found in the document.');
        }
    } else {
        alert('No checkout information found.');
    }
});

// Utility function to format numbers with commas
function formatNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function capitalizeEachWord(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
