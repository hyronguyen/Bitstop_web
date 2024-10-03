// Test
const productsDB = {
    "P001": { name: "Product 1", price: 100 },
    "P002": { name: "Product 2", price: 200 },
    "P003": { name: "Product 3", price: 150 }
  };
  
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
  
  // Sự kiện khi nhập ID
  function attachProductIdListener(row) {
    const productIdInput = row.querySelector(".product-id");
    const productNameInput = row.querySelector(".product-name");
    const productPriceInput = row.querySelector(".product-price");
    const productQuantityInput = row.querySelector(".product-quantity");
  
    productIdInput.addEventListener("blur", function () {
      const productId = productIdInput.value.trim();
  
      // Check if the entered ID is unique, excluding the current input field
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
  
  // Add a new row with product ID and quantity input fields
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
  
  // Handle row removal for the initial row
  document.querySelector(".remove-row").addEventListener("click", function () {
    this.closest("tr").remove();
  });
  
  // hàm sự kiện tạo đơn
  function CreateOrder(){
    collectOrderData();
    alert("succedd");
  }

  function collectOrderData() {
    const allProductRows = document.querySelectorAll("#productRows tr");
    const purchaseItems = [];
    
    // Loop through each product row and gather details
    for (const row of allProductRows) {
      const ID = row.querySelector(".product-id").value.trim();
      const NAME = row.querySelector(".product-name").value.trim();
      const PRICE = row.querySelector(".product-price").value.trim();
      const QUANTITY = row.querySelector(".product-quantity").value.trim();
  
      // Check if productId is empty, alert and return early if it is
      if (!ID) {
        alert("Product ID cannot be empty. Please fill in all product details.");
        return; // Exit the function early to prevent further execution
      }
  
      // Add the product details to the products array if all fields are filled
      if (NAME && PRICE && QUANTITY) {
        purchaseItems.push({
          ID,
          NAME,
          PRICE,
          QUANTITY
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
    console.log(orderData);
  
  }
  
  