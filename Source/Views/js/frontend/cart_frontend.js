let cart;
let deli;

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        cart = localStorage.getItem('cart');
        if(!cart){
            const cartInnerDiv = document.querySelector('.table');
        cartInnerDiv.innerHTML = ''; // Clear the cart content first

        // If the cart is empty, load the image
        const emptyCartImage = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" style="width:200px; height:auto;">
                    <p>Your cart is empty</p>
                </td>
            </tr>
        `;
        cartInnerDiv.insertAdjacentHTML('beforeend', emptyCartImage);
        }
        else{
          DisplayCart(cart);
        }
        
    }
});

//#region Display giỏ hàng
async function DisplayCart(cart) {
    let yourCart = JSON.parse(cart);
    const cartTableBody = document.querySelector('tbody');
    cartTableBody.innerHTML = '';
    let subtotal =0;

    if (!cart || JSON.parse(cart).length === 0) {
        const cartInnerDiv = document.querySelector('.table');
        cartInnerDiv.innerHTML = ''; // Clear the cart content first

        // If the cart is empty, load the image
        const emptyCartImage = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" style="width:200px; height:auto;">
                    <p>Your cart is empty</p>
                </td>
            </tr>
        `;
        cartInnerDiv.insertAdjacentHTML('beforeend', emptyCartImage);
        return; // Stop further execution as the cart is empty
    }

    // Render the products in the cart
    for (let item of yourCart) {
        const product = await apigetProductsById(item.id);
        const total = product.price * item.quantity;
        let stt = "sst_" + product.id;
        let totalId = "total_" + product.id;
        let titleId = "title_" +product.id;

        subtotal += total;  

        const row = `
            <tr>
                <td>
                    <div class="media">
                        <div class="d-flex">
                            <img src="${product.img.split(' ')[0]}" alt="${product.title}" style="width: 151.6px; height:101.5px; object-fit:cover">
                        </div>
                        <div class="media-body">
                            <p id="${titleId}">${product.title}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <h5>${formatNumberWithCommas(product.price)} VND</h5>
                </td>
                <td>
                    <div class="product_count">
                         <input type="text" name="qty" id="${stt}" maxlength="12" value="${item.quantity}" title="Quantity:" class="input-text qty">
                         <button onclick="updateQuantity('${item.id}','${stt}', '${totalId}', ${product.price}, 1)" class="increase items-count" type="button"><i class="lnr lnr-chevron-up"></i></button>
                         <button onclick="updateQuantity('${item.id}','${stt}', '${totalId}', ${product.price}, -1)" class="reduced items-count" type="button"><i class="lnr lnr-chevron-down"></i></button>
                    </div>
                </td>
                <td>
                    <h5 id="${totalId}">${formatNumberWithCommas(total)} VND</h5>
                </td>
            </tr>
        `;

        cartTableBody.insertAdjacentHTML('beforeend', row);

        // Thay đổi thành tiên khi nhập trực tiếp vào ô số lượng
        document.getElementById(stt).addEventListener('input', function() {
            updateQuantity(item.id,stt, totalId, product.price, 0);
        });
    }

    
    const paymentInfo = `
        <tr class="bottom_button">
            <td></td>
            <td></td>
            <td></td>
            <td>
                <div class="cupon_text d-flex align-items-center">
                    <input type="text" placeholder="Coupon Code">
                    <a class="primary-btn" >Apply</a>
                    <a class="gray_btn" >Close</a>
                </div>
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td>
                <h5>Subtotal</h5>
            </td>
            <td>
                <h5 id="subtotal">${formatNumberWithCommas(subtotal)} VND</h5>
            </td>
        </tr>
        <tr class="shipping_area">
            <td></td>
            <td></td>
            <td>
                <h5>Payment method</h5>
            </td>
            <td>
                <div class="shipping_box">
                    <ul class="list">
                        <li id="shipCOD"><a>Ship COD</a></li>
                        <li id="bankingQR" class="active"><a >Banking/ Viet Qr</a></li>
                    </ul>
                    <h6>Calculate Shipping <i class="fa fa-caret-down" aria-hidden="true"></i></h6>

                   <input id="customer_name" type="text" placeholder="Name">

                    <select class="shipping_select">
                        <option value="1">Viet Nam</option>
                        <option value="2">US</option>
                        <option value="4">Japan</option>
                    </select>
                    
                    <input id="customer_address" type="text" placeholder="Address">

                    <input id="customer_phone" type="text" maxlength="12" placeholder="Phone number">

                    <a class="gray_btn" style="cursor:pointer">Use your default address</a>
                </div>
            </td>
        </tr>
        <tr class="out_button_area">
            <td></td>
            <td></td>
            <td></td>
            <td>
                <div class="checkout_btn_inner d-flex align-items-center">
                    <a class="gray_btn" href="category.html">Continue Shopping</a>
                    <a class="primary-btn" id="checkout_button">Checkout</a>
                </div>
            </td>
        </tr>
    `;

    cartTableBody.insertAdjacentHTML('beforeend', paymentInfo);

    DeliveryChoice();
     
    document.getElementById("checkout_button").addEventListener('click', ()=>{
        CheckOut();
    });

}

//#endregion


//#region Cập nhật số lượng và thành tiền

function updateQuantity(productId, quantityInputId, totalId, price, change) {
    let quantityInput = document.getElementById(quantityInputId);
    let quantity = parseInt(quantityInput.value, 10);
    
    if (isNaN(quantity)) quantity = 0;
    
    // Cập nhật lại số lượng dựa vào biến change chuyền vào
    quantity = Math.max(0, quantity + change); 
    quantityInput.value = quantity;

    //Xóa sản phẩm khỏi render và localstorage
    if (quantity === 0) {
        removeFromCart(productId);
        removeRowFromTable(quantityInputId);
    } else {
        // nhập nhật lại số tiền và thành tiền ra html
        let newTotal = price * quantity;
        document.getElementById(totalId).innerText = `${formatNumberWithCommas(newTotal)} VND`;
        updateCartInLocalStorage(productId, quantity);
    }

    updateSubtotal();
}

// Function xóa sản phẩm khỏi localstorage
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
}

// Function cập nhật sản phẩm ở localstorage
function updateCartInLocalStorage(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let updatedCart = cart.map(item => {
        if (item.id === productId) {
            item.quantity = quantity;  // Update the quantity
        }
        return item;
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
}

// Function xóa sản phẩm khỏi html
function removeRowFromTable(quantityInputId) {
    const row = document.getElementById(quantityInputId).closest('tr');
    row.remove();
}

function updateSubtotal() {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let subtotal = 0;

    cart.forEach(item => {
        const productElement = document.getElementById("total_" + item.id);
        if (productElement) {
            const totalPriceText = productElement.innerText;
            const totalPrice = parseInt(totalPriceText.replace(/[^0-9]/g, ''));
            subtotal += totalPrice;
        }
    });

    document.getElementById('subtotal').innerText = `${formatNumberWithCommas(subtotal)} VND`;
}

function DeliveryChoice(){
    const shipCOD = document.getElementById('shipCOD');
  const bankingQR = document.getElementById('bankingQR');

  shipCOD.addEventListener('click', function() {
    deli=2;
    shipCOD.classList.add('active'); 
    bankingQR.classList.remove('active'); 
  });

  bankingQR.addEventListener('click', function() {
    deli=1;
    bankingQR.classList.add('active');
    shipCOD.classList.remove('active');
  });
  
}

function CheckOut() {
    const customerName = document.getElementById('customer_name').value.trim();
    const customerAddress = document.getElementById('customer_address').value.trim();
    const customerPhone = document.getElementById('customer_phone').value.trim();
    const subtotal = parseInt(document.getElementById('subtotal').innerText.replace(/[^0-9]/g, ''));

 
    if (!customerName || !customerAddress || !customerPhone) {
        alert('Please fill out all required fields: Name, Address, and Phone number.');
        return; 
    }


    if (localStorage.getItem('inforCheckout')) {
        localStorage.removeItem('inforCheckout');
    }


    let cart = localStorage.getItem('cart');
    let cartItems = cart ? JSON.parse(cart) : [];


    let inforCheckout = {
        customerName: customerName,
        customerAddress: customerAddress,
        customerPhone: customerPhone,
        subtotal: subtotal,
        items: []
    };

  
    cartItems.forEach(item => {
 
        const totalId = `total_${item.id}`;
        const totalElement = document.getElementById(totalId);
        const total = parseInt(totalElement.innerText.replace(/[^0-9]/g, ''));

        // Get the product name from the p tag using titleId
        const titleId = `title_${item.id}`;
        const titleElement = document.getElementById(titleId);
        const title = titleElement ? titleElement.innerText : 'Unknown Product';

        // Add the product details to the inforCheckout object
        inforCheckout.items.push({
            id: item.id,
            quantity: item.quantity,
            total: total, // Add total price of each product
            title: title  // Add product name
        });
    });

    localStorage.setItem('inforCheckout', JSON.stringify(inforCheckout));
    localStorage.removeItem('cart');

    if(deli===1){
        window.location.href = 'checkout.html';
    }
    else{
        alert("Đã tạo đơn COD");
        window.location.href = 'index.html';
    }
}




//#endregion


//#region ULT FUNCTION
function formatNumberWithCommas(number) {
    return number.toLocaleString();
}

function capitalizeEachWord(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
//#endregion


