let currentlist;
let purchaseList = [];
let invoiceItems = [];

// When the page loads
document.addEventListener('DOMContentLoaded', () => {
   LoadProducts();
   LoadPurchaseItems();
   
   // Render ra Invoce
   document.getElementById('checkNccId_btn').addEventListener('click', handleCheckInvoiceId);
   // Xử lý nhập kho
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

// Render danh sách sản phẩm trong kho
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

// Load thông tin Hóa đơn mua hàng
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

// Chức năng kiểm tra ID hóa đơn
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

// Chức năng Render Hóa đơn
function displayPurchaseDetails(purchase) {
    document.getElementById('invoiceId').value = purchase.id;
    document.getElementById('invoiceNccOrder').value = purchase.nccOrder;
    document.getElementById('invoiceSupplier').value = "Supplier ABC";  // Assuming a fixed supplier for now
    document.getElementById('invoiceDate').value = purchase.date;
    document.getElementById('invoiceStatus').value = purchase.status;

    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = ''; 
    invoiceItems = []; // Reset the global items array

    purchase.items.forEach((item, index) => {
        const itemRow = `
        <div class="mb-3 row">
            <label for="itemId${index}" class="col-sm-3 col-form-label">Item ID</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" id="itemId${index}" value="${item.item_id}" disabled>
            </div>
        </div>
        <div class="mb-3 row">
            <label for="itemName${index}" class="col-sm-3 col-form-label">Item Name</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" id="itemName${index}" value="${item.item_name}" disabled>
            </div>
        </div>
        <div class="mb-3 row">
            <label for="itemQty${index}" class="col-sm-3 col-form-label">Quantity</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" id="itemQty${index}" value="${item.item_qty}" disabled>
            </div>
        </div>
        <div class="mb-3 row">
            <label for="itemPrice${index}" class="col-sm-3 col-form-label">Price</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" id="itemPrice${index}" value="${item.item_price}" disabled>
            </div>
        </div>
        <hr>
    `;
        itemsList.innerHTML += itemRow;  
        invoiceItems.push({
            item_id: item.item_id,
            item_name: item.item_name,
            item_qty: item.item_qty,
            item_price: item.item_price
        });
    });

    document.getElementById('invoiceFormSection').style.display = 'block';
}

// Chức năng cập nhật kho
function handleStockGoods(event) {
    event.preventDefault(); 
    try{
        if (invoiceItems.length === 0) {
            alert('No items to process.');
            return;
        }
        
        console.log(`Number of items to process: ${invoiceItems.length}`);
    
        // Loop through each item in invoiceItems and update product quantities
        invoiceItems.forEach(item => {
            const product = {
                identify: item.item_id,  // Assuming each item has 'identify'
                qa: item.item_qty,              // Assuming each item has 'qa'
            };
    
            
             apiUpdateProductQuantity(product);
        });
    }
    catch (error){
        console.log(error);
    }

    
}


