let currentlist;
let purchaseList = [];
let invoiceItems = [];
let smList = [];
let currentSmIndex = null;
let doneSMList =[]; // Biến để lưu index của SM item hiện tại


// When the page loads
document.addEventListener('DOMContentLoaded', () => {


   LoadProducts();
   LoadPurchaseItems();
   
   
   // Render ra Invoce
   document.getElementById('checkNccId_btn').addEventListener('click', handleCheckInvoiceId);
   // Khi tab Done Output được bấm, gọi hàm LoadDoneSMItems
   // Xử lý nhập kho
   document.getElementById('add_btn').addEventListener('click', handleStockGoods);

   // Tab Output Request
   const output = document.getElementById('output-tab');
   output.addEventListener('shown.bs.tab', function(event) {
    if (event.target.id === 'output-tab') {
        LoadSMItems();
    }
     });

    // Tab Output Done
   const done = document.getElementById('doneoutput');
   done.addEventListener('shown.bs.tab', function(event) {
    if (event.target.id === 'doneoutput') {
        LoadDoneSMItems();
    }
     });

      // Tab Output Done
   const stockproduct = document.getElementById('list-tab');
   stockproduct.addEventListener('shown.bs.tab', function(event) {
    if (event.target.id === 'list-tab') {
        LoadProducts();
    }
     });


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
            <td>${capitalizeEachWord(product.title)}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.platform}</td>
            <td>${product.identify}</td>
            <td>${product.qa}</td>
            <td><img src="${thumbnail}" alt="Product Image"  width="50" height="50" style="object-fit:cover"></td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="editProduct('${product.identify}')"><i class="fa-solid fa-database"></i></button>
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
                identify: item.item_id,  
                qa: item.item_qty,       
            };
    
            // Gọi API để cập nhật số lượng sản phẩm
            apiUpdateProductQuantity(product);
        }
        

        // Sau khi cập nhật kho thành công, cập nhật trạng thái đơn hàng
        updatePurchaseStatus(purchaseId);

        // Call the new function to create an SM input record
        handleCreateSMInput(purchaseId, invoiceItems);

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
        const currentStatus = document.getElementById('invoiceStatus');
        currentStatus.value = "Delivered";

    
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

// Function to load SM items from the API and map them for rendering
async function LoadSMItems() {
    try {
        const smData = await apiGetSMItems(); // Call the API to fetch SM items



        // Map the received data into a structured format
        smList = smData.map(item => {
            
            return {
                sm_id: item.sm_id,           // Stock Management ID
                sm_date: item.sm_date,       // Date of the SM entry
                sm_des: item.sm_des,         // Description
                sm_status: item.sm_status,   // Status of the SM (Input/Output)
                sm_type: item.sm_type,       // Type (Input/Output)
                sm_items: item.sm_items,      // Items in the SM
                sm_res:   item.sm_res
            };
        });

        // Render the list of SM items after fetching
        renderSMList(smList);
    } catch (error) {
        console.error('Error loading SM items:', error);
    }
}

// Function to render the list of SM items in a table
function renderSMList(smList) {
    const smListTable = document.getElementById('product-list-output'); // Assume the table has this ID
    smListTable.innerHTML = ''; // Clear the current list

    console.log('Rendering SM List...'); // Log when rendering starts
    smList.forEach((smItem, index) => {
        // Prepare the items data to display
        const smItemsDetails = smItem.sm_items.map(item => 
            `${item.item_name} (ID: ${item.item_id}, Qty: ${item.item_qty}, Price: ${item.item_price})`
        ).join('<br>');

        // Log the current SM item being rendered
        console.log(`Rendering SM Item [${index + 1}]:`, smItem);

        const smDate = new Date(smItem.sm_date.seconds * 1000);
      const formattedDate = smDate.toLocaleDateString('en-GB');

       // Get the status badge class
       const statusBadgeClass = getOrderStatusBadge(smItem.sm_status);

        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${smItem.sm_id}</td>
            <td>${formattedDate}</td>
            <td>${smItem.sm_des}</td>
            <td><span class="badge ${statusBadgeClass}">${smItem.sm_status}</span></td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="viewDetails(${index})">View Details</button>
            </td>
          </tr>
        `;
        smListTable.innerHTML += row; // Append the new row to the table
    });

    console.log('Rendered SM List Table:', smListTable.innerHTML); // Log the final rendered HTML of the table
}

// xem chi tiết
function viewDetails(index) {
    const smItem = smList[index]; 

    currentSmIndex = index; 
    const smDate = new Date(smItem.sm_date.seconds * 1000);
    const formattedDate = smDate.toLocaleDateString('en-GB');

    document.getElementById('smId').value = smItem.sm_id;
    document.getElementById('smDate').value = formattedDate;
    document.getElementById('smDescription').value = smItem.sm_des;
    document.getElementById('smRes').value = smItem.sm_res; // Resource field
    document.getElementById('smStatus').value = smItem.sm_status;
    document.getElementById('smType').value = smItem.sm_type;

    // Hiển thị các mục
    const smItemsContainer = document.getElementById('smItemsContainer');
    smItemsContainer.innerHTML = ''; // Clear existing items

    smItem.sm_items.forEach(item => {
        const itemCard = `
            <div class="card mb-2 border-secondary">
                <div class="card-body">
                    <h6 class="card-title">Item ID: ${item.id}</h6>
                    <p class="card-text"><strong>Name:</strong> ${item.title}</p>
                    <p class="card-text"><strong>Price:</strong> ${item.total}</p>
                    <p class="card-text"><strong>Quantity:</strong> ${item.quantity}</p>
                </div>
            </div>
        `;
        smItemsContainer.innerHTML += itemCard; // Append item details
    });

    const acceptButton = document.getElementById('accpectbutton');
    acceptButton.style.display = 'inline-block';

    // Hiển thị modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

// xem chi tiết Done
function viewDetailsDone(index) {
    const smItem = doneSMList[index]; 

    currentSmIndex = index; 

    const smDate = new Date(smItem.sm_date.seconds * 1000);
    const formattedDate = smDate.toLocaleDateString('en-GB');

    document.getElementById('smId').value = smItem.sm_id;
    document.getElementById('smDate').value = formattedDate;
    document.getElementById('smDescription').value = smItem.sm_des;
    document.getElementById('smRes').value = smItem.sm_res; // Resource field
    document.getElementById('smStatus').value = smItem.sm_status;
    document.getElementById('smType').value = smItem.sm_type;

   

    // Hiển thị các mục
    const smItemsContainer = document.getElementById('smItemsContainer');
    smItemsContainer.innerHTML = ''; // Clear existing items

    smItem.sm_items.forEach(item => {
        const itemCard = `
            <div class="card mb-2 border-secondary">
                <div class="card-body">
                    <h6 class="card-title">Item ID: ${item.id}</h6>
                    <p class="card-text"><strong>Name:</strong> ${item.title}</p>
                    <p class="card-text"><strong>Price:</strong> ${item.total}</p>
                    <p class="card-text"><strong>Quantity:</strong> ${item.quantity}</p>
                </div>
            </div>
        `;
        smItemsContainer.innerHTML += itemCard; // Append item details
    });
    const acceptButton = document.getElementById('accpectbutton');
    acceptButton.style.display = 'none'


    // Hiển thị modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

async function saveChanges() {
    try{
    const smItems = smList[currentSmIndex].sm_items;
    const SmDescription = smList[currentSmIndex].sm_des;
    const orderId = SmDescription.split("order:")[1].trim();
    console.log(orderId);

    for (const smItem of smItems) {
        const productId = smItem.id;
        const quantityToSubtract = smItem.quantity;

        const productInStock = currentlist.find(product => product.identify === productId);

        if (productInStock) {
            const newQuantity = quantityToSubtract;
            productInStock.qa = newQuantity;

            // Trừ số lượng trong kho
            await apiSubstractProductQuantity(productInStock);

        } else {
            console.warn(`Product ID: ${productId} not found in stock.`);
        }
    }

    smList[currentSmIndex].sm_status = "Done";

    const sm_id = smList[currentSmIndex].sm_id;

    // Cập nhật SM thành Done
    await apiUpdateSMStatus(sm_id, 'Done');
    
    await apiUpdateDeliverOrder(orderId);

    renderSMList(smList);
    alert("Stock has been successfully processed and SM status updated to 'Done'.");
    }
    catch(error){
        console.log(error);
    }
}

// Function to load SM items with status 'done' from the API and map them for rendering
async function LoadDoneSMItems() {
    try {
        const smData = await apiGetDoneSMItems(); // Call the API to fetch SM items

        // Lọc các mục có trạng thái 'done'
         doneSMList = smData.filter(item => item.sm_status === 'Done').map(item => {
            return {
                sm_id: item.sm_id,           // Stock Management ID
                sm_date: item.sm_date,       // Date of the SM entry
                sm_des: item.sm_des,         // Description
                sm_status: item.sm_status,   // Status (done)
                sm_type: item.sm_type,       // Type (Input/Output)
                sm_items: item.sm_items,     // Items in the SM
                sm_res: item.sm_res          // Resource
            };
        });

        // Log the filtered list of 'done' SM items
        console.log('Done SM List:', doneSMList);

        // Render the list of 'done' SM items
        renderDoneSMList(doneSMList);
    } catch (error) {
        console.error('Error loading Done SM items:', error);
    }
}

// Function to render the list of 'done' SM items in a table
function renderDoneSMList(smList) {
    const doneSMTable = document.getElementById('product-list-done'); // Table body for 'done' SMs
    doneSMTable.innerHTML = ''; // Clear the current list

    smList.forEach((smItem, index) => {
        // Format the date
        const smDate = new Date(smItem.sm_date.seconds * 1000);
        const formattedDate = smDate.toLocaleDateString('en-GB');

         // Get the status badge class
       const statusBadgeClass = getOrderStatusBadge(smItem.sm_status);

        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${smItem.sm_id}</td>
            <td>${formattedDate}</td>
            <td>${smItem.sm_des}</td>
               <td><span class="badge ${statusBadgeClass}">${smItem.sm_status}</span></td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="viewDetailsDone(${index})">View Details</button>
            </td>
          </tr>
        `;
        doneSMTable.innerHTML += row; // Append the new row to the table
    });

    console.log('Rendered Done SM List Table:', doneSMTable.innerHTML); // Log the rendered table
}

function editProduct(productId) {
    console.log('Editing product with ID:', productId);
    
    const newQuantity = prompt('Enter new quantity:');
    console.log('Entered quantity:', newQuantity);
    
    if (newQuantity === null) {
        console.log('User cancelled the prompt.');
        return;
    }
    
    if (isNaN(newQuantity) || newQuantity.trim() === '' || parseInt(newQuantity) < 0) {
        alert('Please enter a valid positive number for the quantity.');
        console.log('Invalid quantity entered:', newQuantity);
        return;
    }
    
    const quantity = parseInt(newQuantity);
    console.log('Parsed quantity:', quantity);
    
    const confirmUpdate = confirm(`Are you sure you want to update the product quantity to ${quantity}?`);
    console.log('User confirmation to update quantity:', confirmUpdate);
    
    if (confirmUpdate) {
        console.log('About to call API with:', productId, quantity);  // Added log for debugging
        apiUpdateEditStockQuantity(productId, quantity)
            .then(response => {
                console.log('API response:', response);
                alert('Product quantity updated successfully!');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating product quantity:', error.message);
                alert('Failed to update product quantity. Please try again.');
            });
    } else {
        alert('Product quantity update cancelled.');
    }
}

function capitalizeEachWord(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getOrderStatusBadge(status) {
    switch (status.toLowerCase()) {
        case 'done':
            return 'bg-success';
        case 'processing':
            return 'bg-warning';
        default:
            return 'bg-secondary';
    }
}

