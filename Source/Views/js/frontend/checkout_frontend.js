document.addEventListener('DOMContentLoaded', () => {
    // Fetch inforCheckout from local storage
    const inforCheckout = JSON.parse(localStorage.getItem('inforCheckout'));

    // Check if inforCheckout is available
    if (inforCheckout) {
   
        const orderItemsList = document.getElementById('orderItemsList');
        const subtotalDisplay = document.getElementById('subtotalDisplay');
        const totalDisplay = document.getElementById('totalDisplay');

        // Ensure elements are found before updating them
        if (orderItemsList && subtotalDisplay && totalDisplay) {
    

            inforCheckout.items.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.innerHTML = `<a href="#">${capitalizeEachWord(item.title)} <span class="middle">x ${item.quantity}</span> <span class="last">${formatNumberWithCommas(item.total)} VND</span></a>`;
                orderItemsList.appendChild(itemElement);
            });

          
            subtotalDisplay.innerText = formatNumberWithCommas(inforCheckout.subtotal) + ' VND';

            // Tính tổng
            const shippingCost = 30000;
            const total = inforCheckout.subtotal + shippingCost;
            totalDisplay.innerText = formatNumberWithCommas(total) + ' VND';

            // Tạo Qr
            let  BANK_ID = "970422"
            let ACCOUNT_NO = "0888399950"
            let AMOUNT = total;
            let Des ="Chuyển khoản thanh toán bitstop";

            const QRelement = document.getElementById("qr_img");
            let Qrlink = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${AMOUNT}&addInfo=${encodeURIComponent(Des)}&accountName=Nguyễn Hồ Ngọc Huy`;
            QRelement.src = Qrlink;
        } 
         else {
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
