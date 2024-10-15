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
            <td><img src="${thumbnail}" alt="Product Image"  width="50" height="50" style="object-fit:cover"></td>
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
                items: item.pur_items,
                res: item.pur_res,
                invo: item.pur_invo         // Items array
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


    // Update the download button's href with the PDF URL
    const downloadButton = document.getElementById('downloadInvoiceBtn');
    const pdfErrorMsg = document.getElementById('pdfErrorMsg');

    if (purchase.invo) {
        downloadButton.href = purchase.invo;  // Set the PDF URL for download
        downloadButton.style.display = 'inline-block';  // Show the download button
        pdfErrorMsg.style.display = 'none';  // Hide error message
    } else {
        downloadButton.style.display = 'none';  // Hide the download button
        pdfErrorMsg.style.display = 'block';  // Show error message
    }
    
    document.getElementById('invoiceFormSection').style.display = 'block';
}

// Hàm để xử lý việc cập nhật kho
async function handleStockGoods(event) {
    event.preventDefault(); 

    try {
        if (invoiceItems.length === 0) {
            alert('No items to process.');
            return;
        }

        // Lấy giá trị từ ô input invoiceId
        const purchaseId = document.getElementById('invoiceId').value;
        const currentStatus = document.getElementById('invoiceStatus').value;  // Lấy trạng thái hiện tại

        if (!purchaseId) {
            alert('Không tìm thấy thông tin hóa đơn');
            return;
        }

        // Kiểm tra nếu đơn hàng đã được xử lý trước đó
        if (currentStatus === 'Delivered') {
            alert('Đơn hàng này đã được xử lý');
            return;
        }

        console.log(`Number of items to process: ${invoiceItems.length}`);
        console.log(`Processing Invoice ID: ${purchaseId}`);

        // Cập nhật kho cho từng item
        for (const item of invoiceItems) {
            const product = {
                identify: item.item_id,  // Assuming each item has 'identify'
                qa: item.item_qty,       // Assuming each item has 'qa'
            };
    
            // Gọi API để cập nhật số lượng sản phẩm
            await apiUpdateProductQuantity(product);
        }

        // Sau khi cập nhật kho thành công, cập nhật trạng thái đơn hàng
        await updatePurchaseStatus(purchaseId);

        // Call the new function to create an SM input record
        await handleCreateSMInput(purchaseId, invoiceItems);
        
        // Thông báo người dùng
        alert('Số lượng tồn đã được cập nhật và trạng thái đơn hàng đã chuyển sang "Delivered"');

    } catch (error) {
        console.error('Error:', error);
    }
}

// Hàm để cập nhật trạng thái đơn hàng
async function updatePurchaseStatus(purchaseId) {
    try {
        if (!purchaseId) {
            alert('Không tìm thấy thông tin hóa đơn');
            return;
        }

        // Gọi API để cập nhật trạng thái đơn hàng
        await apiUpdatePurchaseStatus(purchaseId);
    
    } catch (error) {
        console.error('Error updating purchase status:', error);
    }
}

// Hàm để thêm đơn input
async function handleCreateSMInput(purchaseId, smItems) {
    try {
        // Create a new SM input record
        const smDes = 'Stock goods input';  // Description can be customized or dynamic
        await apiCreateSMInput(purchaseId, smItems, smDes);

        alert('SM Input created successfully!');  // Consider using a better UI notification
    } catch (error) {
        console.error('Error creating SM Input:', error);
        alert('Failed to create SM Input. Please try again.');  // Inform user of the error
    }
}
