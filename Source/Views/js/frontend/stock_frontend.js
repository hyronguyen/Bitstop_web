let currentlist;
let purchaseList = [];

// When the page loads
document.addEventListener('DOMContentLoaded', () => {
   LoadProducts();
   LoadPurchaseItems();
   
   // Add event listener for the Check Invoice ID button
   document.getElementById('checkNccId_btn').addEventListener('click', handleCheckInvoiceId);
   
   // Add event listener for the form submission (if you have functionality to stock goods)
   document.getElementById('add_btn').addEventListener('click', handleStockGoods);
});

// Thêm sự kiện lắng nghe khi tab "Stock List" được nhấn
document.getElementById('list-tab').addEventListener('click', () => {
    // Ẩn phần hiển thị hóa đơn
    document.getElementById('invoiceFormSection').style.display = 'none';
});
 

// Load danh sách sản phẩm
async function LoadProducts() {
    try {
        const productData = await apiGetStorageItems();
        const productList = productData.map(items => {
            return {
                identify: items.sto_product,   // identify
                qa: items.sto_qa,             // qa
                title: items.pro_title,       // title
                price: items.pro_price,       // price
                category: items.pro_category, // category
                platform: items.pro_platform, // platform
                img: items.pro_img            // img
            };
        });
        currentlist = productList;

        renderProductList(currentlist);
    
    } catch (error) {
        console.log(error);
    }
}

// Render product list (this is your inventory)
function renderProductList(productList) {
    const productListStock = document.getElementById('product-list-stock');
    productListStock.innerHTML = ''; // Clear the current list

    productList.forEach((product, index) => {

        const thumbnail = product.img.split(" ")[0];
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${product.title}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.platform}</td>
            <td>${product.identify}</td>
            <td>${product.qa}</td>
            <td><img src="${thumbnail}" alt="Product Image" width="50" height="50"></td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="editProduct(${index})">Edit</button>
            </td>
          </tr>
        `;
        productListStock.innerHTML += row;
    });
}

// Load purchase information (invoices)
async function LoadPurchaseItems() {
    try {
        const purchaseData = await apiGetPurchaseItems();
        purchaseList = purchaseData.map(item => {
            return {
                id: item.id,                    // Document ID (Invoice ID)
                nccOrder: item.pur_ncc,         // NCC Order
                date: item.pur_date,            // Date
                status: item.pur_status,        // Status
                items: item.pur_items           // Items array
            };
        });

        console.log("Processed purchase list:", purchaseList);

    } catch (error) {
        console.log(error);
    }
}

// Handle Check Invoice ID
function handleCheckInvoiceId() {
    const invoiceIdInput = document.getElementById('addNccOrder').value.trim(); // Get the input value

    if (invoiceIdInput === "") {
        alert("Please enter an Invoice ID.");
        return;
    }

    console.log("Invoice ID entered:", invoiceIdInput);  // Log the entered Invoice ID

    // Find the purchase by Invoice ID
    const purchase = purchaseList.find(p => p.id === invoiceIdInput);  // Check if the entered ID matches any invoice ID

    console.log("Matching purchase found:", purchase);  

    if (purchase) {
        displayPurchaseDetails(purchase);  // Display the purchase details if found
    } else {
        alert("No purchase found with this Invoice ID.");
    }
}

// Function to display purchase details in the form below the search
function displayPurchaseDetails(purchase) {
    // Update the invoice form values
    document.getElementById('invoiceId').value = purchase.id;
    document.getElementById('invoiceNccOrder').value = purchase.nccOrder;
    document.getElementById('invoiceSupplier').value = "Supplier ABC";  // Assuming a fixed supplier for now
    document.getElementById('invoiceDate').value = purchase.date;
    document.getElementById('invoiceStatus').value = purchase.status;

    // Clear the items list first
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';  // Clear any previous items

    // Loop through the items array and create a row for each item
    purchase.items.forEach((item, index) => {
        const itemRow = `
            <div class="mb-3">
                <label for="itemId${index}" class="form-label">Item ID</label>
                <input type="text" class="form-control" id="itemId${index}" value="${item.item_id}" disabled>
            </div>
            <div class="mb-3">
                <label for="itemName${index}" class="form-label">Item Name</label>
                <input type="text" class="form-control" id="itemName${index}" value="${item.item_name}" disabled>
            </div>
            <div class="mb-3">
                <label for="itemQty${index}" class="form-label">Quantity</label>
                <input type="text" class="form-control" id="itemQty${index}" value="${item.item_qty}" disabled>
            </div>
            <div class="mb-3">
                <label for="itemPrice${index}" class="form-label">Price</label>
                <input type="text" class="form-control" id="itemPrice${index}" value="${item.item_price}" disabled>
            </div>
            <hr>
        `;
        itemsList.innerHTML += itemRow;  // Append each item row to the items list
    });

    // Show the form section with the invoice details
    document.getElementById('invoiceFormSection').style.display = 'block';
}

// Handle Stock Goods
function handleStockGoods(event) {
    event.preventDefault(); // Ngăn form gửi yêu cầu

    // Lấy danh sách các items từ hóa đơn (được hiển thị sau khi kiểm tra Invoice ID)
    const itemsList = document.querySelectorAll('#itemsList > div');
    
    // Nếu không có item nào trong hóa đơn, hiển thị thông báo và dừng xử lý
    if (itemsList.length === 0) {
        alert('No items to process.');
        return;
    }

    console.log(`Number of items to process: ${itemsList.length}`); // Ghi lại số lượng sản phẩm cần xử lý

    // Duyệt qua từng item trong hóa đơn
    itemsList.forEach((itemRow, index) => {
        // Lấy ID sản phẩm và số lượng từ hóa đơn
        const itemId = document.getElementById(`itemId${index}`).value;
        const itemQty = parseInt(document.getElementById(`itemQty${index}`).value, 10);

        if (!itemId || isNaN(itemQty) || itemQty <= 0) {
            console.log(`Skipping invalid item at index ${index}: ID = ${itemId}, Quantity = ${itemQty}`); 
            return; // Bỏ qua nếu ID hoặc số lượng không hợp lệ
        }

        console.log(`Processing item ${index + 1}: ID = ${itemId}, Quantity = ${itemQty}`); // Ghi lại thông tin từng item đang xử lý

        // Tìm sản phẩm tương ứng trong danh sách hàng tồn kho bằng cách khớp ID
        const productInStock = currentlist.find(product => product.identify === itemId);

        if (productInStock) {
            // Nếu tìm thấy sản phẩm trong kho, cập nhật số lượng
            productInStock.qa = (productInStock.qa || 0) + itemQty; // Cộng thêm số lượng từ hóa đơn vào số lượng hiện có
            console.log(`Updated stock for ${productInStock.title}: new quantity is ${productInStock.qa}`); // Ghi lại cập nhật số lượng

            // Gọi hàm api để cập nhật tồn kho vào database
            apiUpdateProductQuantity(productInStock);
        } else {
            console.log(`Item with ID ${itemId} not found in the stock.`); // Ghi lại nếu không tìm thấy sản phẩm
        }
    });

    // Hiển thị lại danh sách hàng tồn kho sau khi xử lý
    console.log("Re-rendering the updated stock list...");
    renderProductList(currentlist);

    // Ẩn form sau khi cập nhật tồn kho thành công
    document.getElementById('invoiceFormSection').style.display = 'none';
    
    // Hiển thị thông báo cập nhật thành công
    alert('Stock updated successfully!');
}

/// Hàm xử lý cập nhật tồn kho từ frontend
async function apiUpdateProductQuantity(product) {
    try {
        console.log(`Sending update for Product ID: ${product.identify}, Quantity: ${product.qa}`); // Log trước khi gửi yêu cầu

        const response = await fetch('http://localhost:8080/api/updateProductQuantity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identify: product.identify,
                qa: product.qa
            })
        });

        if (!response.ok) {
            console.log('Response status:', response.status); // Log mã trạng thái phản hồi
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Product quantity updated in storage:', data);
    } catch (error) {
        console.error('Error updating product quantity:', error);
    }
}