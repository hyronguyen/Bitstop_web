
const productsDB = {};

document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken'); 

  if (!authToken) {
      window.location.href = 'login.html'; 
  } else 
  {
    LoadLowStock();
    

      console.log('Auth token is present. User is logged in.');
      
      const purchaseTab = document.getElementById('listpur-tab');
      const nccprice = document.getElementById('nccprice-tab');

   purchaseTab.addEventListener('shown.bs.tab', function(event) {
    if (event.target.id === 'listpur-tab') {
      renderPurchases();
    }
     });

     nccprice.addEventListener('shown.bs.tab', function(event) {
      if (event.target.id === 'nccprice-tab') {
       LoadProducts();
      }
       });

      
  }
});

async function LoadProducts() {
  try {
    const productData = await apiGetProductwithNccPrice();
    // Clear productsDB before adding new data (optional based on your requirements)
    Object.keys(productsDB).forEach(key => delete productsDB[key]);

    productData.forEach(items => {
      productsDB[items.docId] = {
        name: items.pro_title,  // Mapping 'title' to 'name'
        price: items.ncc_price  // Keeping the 'price' field as it is
      };
    });

    RenderNCCPRICE(productsDB)
    
  } catch (error) {
    console.log(error);
  }
}

async function LoadLowStock() {
  try{
    const Productlist = await apigetAllProducts();
    const lowStockProducts = Productlist
    .filter(product => product.quan <= 30)
    .sort((a, b) => a.quan - b.quan);
    RenderLowStockProducts(lowStockProducts);

  }
  catch(error){
    console.log(error);
  }
  
  
}

function RenderLowStockProducts(lowStockProducts) {
  const tableBody = document.getElementById('product-list');
  tableBody.innerHTML = ''; // Xóa nội dung cũ trong bảng

  lowStockProducts.forEach((product, index) => {
    const row = document.createElement('tr');

    // Tạo các ô dữ liệu cho từng thuộc tính sản phẩm
    const indexCell = document.createElement('td');
    indexCell.textContent = index + 1; // Số thứ tự

    const titleCell = document.createElement('td');
    titleCell.textContent = capitalizeEachWord(product.title); // Tên sản phẩm

    const categoryCell = document.createElement('td');
    categoryCell.textContent = product.category; // Danh mục

    const priceCell = document.createElement('td');
    priceCell.textContent = formatNumberWithCommas(product.price) + " VND"; // Giá, định dạng thành tiền tệ

    const platformCell = document.createElement('td');
    platformCell.textContent = product.platform; // Nền tảng

    const identifyCell = document.createElement('td');
    identifyCell.textContent = product.id; // Đặc điểm

    const qaCell = document.createElement('td');
    const badge = document.createElement('span');
    
    // Kiểm tra số lượng tồn kho và thêm lớp tương ứng
    if (product.quan < 10) {
      badge.classList.add('badge', 'bg-danger'); // Màu đỏ nếu tồn kho < 10
    } else {
      badge.classList.add('badge', 'bg-warning'); // Màu vàng nếu tồn kho >= 10
    }
    
    badge.textContent = `${product.quan} items in stock`; // Số lượng tồn kho
    qaCell.appendChild(badge); // Thêm badge vào ô

    const imageCell = document.createElement('td');
    const img = document.createElement('img');

    const imageUrls = product.img.split(' ');
    img.src = imageUrls[0] || 'https://via.placeholder.com/50'; // Hình ảnh sản phẩm
    img.alt = 'Product Image';
    img.width = 50; // Đặt chiều rộng
    img.height = 50; // Đặt chiều cao
    img.style.objectFit = 'cover'; // Đảm bảo hình ảnh không bị biến dạng

    imageCell.appendChild(img);

    // Thêm các ô dữ liệu vào hàng
    row.appendChild(indexCell);
    row.appendChild(titleCell);
    row.appendChild(categoryCell);
    row.appendChild(priceCell);
    row.appendChild(platformCell);
    row.appendChild(identifyCell);
    row.appendChild(qaCell);
    row.appendChild(imageCell);

    // Thêm hàng vào bảng
    tableBody.appendChild(row);
  });
}


function RenderNCCPRICE(productData) {
  // Clear previous data in the table
  const tableBody = document.getElementById('nccpriceTableBody');
  tableBody.innerHTML = '';

  // Render new product data
  Object.keys(productData).forEach(docId => {
    const item = productData[docId]; // Lấy sản phẩm từ productsDB

    const row = document.createElement('tr');

    // Tạo các ô dữ liệu cho mỗi sản phẩm
    const productIdCell = document.createElement('td');
    productIdCell.textContent = docId; // ID của tài liệu

    const productNameCell = document.createElement('td');
    productNameCell.textContent = capitalizeEachWord(item.name); // Tên sản phẩm

    const nccPriceCell = document.createElement('td');
    nccPriceCell.textContent = formatNumberWithCommas(item.price)+ " VND"; // Giá NCC

    // Thêm các ô dữ liệu vào hàng
    row.appendChild(productIdCell);
    row.appendChild(productNameCell);
    row.appendChild(nccPriceCell);

    // Thêm hàng vào bảng
    tableBody.appendChild(row);
  });
}

function formatNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Cập nhật price list
document.getElementById('uploadButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];

  if (file) {
    try {
      const result = await apiUpdatePriceListNcc(file);  // Gọi hàm để cập nhật giá
      if (result) {
        // Sau khi cập nhật thành công, tải lại bảng sản phẩm
        LoadProducts();  // Tải lại danh sách sản phẩm với giá NCC mới
        RenderNCCPRICE(productsDB);
      }
    } catch (error) {
      console.error('Error during price list update:', error.message);
    }
  } else {
    alert('Please select a file to upload.');
  }
});
  

  // Check đơn mua không trùng lập
function isProductIdUnique(productIdInput) {
    const allProductIds = document.querySelectorAll(".product-id");
    for (const input of allProductIds) {
      // Skip checking against the current input field
      if (input !== productIdInput && input.value.trim() === productIdInput.value.trim()) {
        return false;
      }
    }
    return true;
  }
  
//Sự kiện khi nhập ID
function attachProductIdListener(row) {
    const productIdInput = row.querySelector(".product-id");
    const productNameInput = row.querySelector(".product-name");
    const productPriceInput = row.querySelector(".product-price");
    const productQuantityInput = row.querySelector(".product-quantity");
  
    productIdInput.addEventListener("blur", function () {
      const productId = productIdInput.value.trim();
  
      // Kiểm tra id với các hàng còn lại
      if (!isProductIdUnique(productIdInput)) {
        alert("Product ID already exists. Please enter a unique Product ID.");
        productIdInput.value = ""; 
        productNameInput.value = "";
        productPriceInput.value = "";
        return;
      }
  
      if (productId && productsDB[productId]) {
        // Fetch product details from the database (or API)
        const product = productsDB[productId];
        productNameInput.value = product.name;
        productPriceInput.value = product.price * productQuantityInput.value; // Calculate initial total price based on quantity
      } else {
        productIdInput.value = ""; 
        productNameInput.value = "";
        productPriceInput.value = "";
        alert("Product not found. Please enter a valid Product ID.");
      }
    });
  
    // Update the price based on quantity change
    productQuantityInput.addEventListener("input", function () {
      const productId = productIdInput.value.trim();
      if (productId && productsDB[productId]) {
        const product = productsDB[productId];
        productPriceInput.value = product.price * productQuantityInput.value; // Update total price dynamically
      }
    });
  }
  
// Initial row product ID listener
attachProductIdListener(document.querySelector("#productRows tr"));
  
// Tạo thêm hàng
document.getElementById("addProductRow").addEventListener("click", function () {
    const productRows = document.getElementById("productRows");
  
    // Tạo hàng mới
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="text" class="form-control product-id" placeholder="Product ID" required></td>
      <td><input type="text" class="form-control product-name" placeholder="Product Name" disabled></td>
      <td><input type="number" class="form-control product-price" placeholder="Price" disabled></td>
      <td><input type="number" class="form-control product-quantity" placeholder="Quantity" min="1" value="1"></td>
      <td><button type="button" class="btn btn-danger remove-row"><i class="fa-regular fa-square-minus"></i></button></td>
    `;

    productRows.appendChild(newRow);
    attachProductIdListener(newRow);
  
    newRow.querySelector(".remove-row").addEventListener("click", function () {
      newRow.remove();
    });
  });
  
// Xóa hàng
document.querySelector(".remove-row").addEventListener("click", function () {
    this.closest("tr").remove();
  });
  
//Hàm tạo order cho purchase
function CreateOrder(){
    collectOrderData();
    alert("succedd");
  }

// Hàm tạo purchase
async function collectOrderData() {
  try{
    const allProductRows = document.querySelectorAll("#productRows tr");
    const purchaseItems = [];
    
    // Loop through each product row and gather details
    for (const row of allProductRows) {
      const item_id = row.querySelector(".product-id").value.trim();
      const item_name = row.querySelector(".product-name").value.trim();
      const item_price = row.querySelector(".product-price").value.trim();
      const item_qty = row.querySelector(".product-quantity").value.trim();
  
      // Check if productId is empty, alert and return early if it is
      if (!item_id) {
        alert("Product ID cannot be empty. Please fill in all product details.");
        return; // Exit the function early to prevent further execution
      }
  
      // Add the product details to the products array if all fields are filled
      if (item_name && item_price && item_qty) {
        purchaseItems.push({
          item_id,
          item_name,
          item_price,
          item_qty
        });
      }
    }
  
    // Simulate getting supplier information
    const purchaseNCC = document.getElementById("addNCCName").value.trim();
  
    // Combine products and supplier info into the final order object
    const orderData = {
      purchaseNCC,
      purchaseItems
    };
  
    // Log the final data
    await apiCreateANewPurchaseOrder(orderData);
    alert("Thành công tạo đơn purchase");
  
  }
  catch(error){
    alert("Tạo đơn purchase thất bại");
  }
    
  }

// Hàm render purchase
 async function renderPurchases() {
  const purchases =  await apiGetAllPurchase();

    const purchaseList = document.getElementById('purchase-list');
    purchaseList.innerHTML = ''; 
  
    purchases.forEach((purchase, index) => {
      
      const purchaseDate = new Date(purchase.pur_date.seconds * 1000);
      const formattedDate = purchaseDate.toLocaleDateString('en-GB');
      const statusBadgeClass = getOrderStatusBadge(purchase.pur_status);


      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${purchase.id || 'N/A'}</td> <!-- Invoice -->
          <td>${purchase.pur_ncc || 'N/A'}</td> <!-- Supplier (NCC) -->
          <td>${purchase.pur_items.length} items</td> <!-- Number of items in purchase -->
          <td>${formattedDate}</td> <!-- Purchase Date -->
          <td>${purchase.pur_res || 'N/A'}</td> <!-- Responsible person -->
          <td><span class="badge ${statusBadgeClass}">${purchase.pur_status}</span></td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="viewDetail()">View detail</button>
          </td>
        </tr>
      `;
      purchaseList.innerHTML += row;
    });
  }
  
// Hàm viết hoa
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