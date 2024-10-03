// Sample data to simulate fetching product details by ID (you'll replace this with actual API calls)
const productsDB = {
    "P001": { name: "Product 1", price: 100 },
    "P002": { name: "Product 2", price: 200 },
    "P003": { name: "Product 3", price: 150 }
  };
  
  // check đơn mua không trùng lập
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
  
  // Event listener for checking the product ID and fetching details
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
        productIdInput.value = ""; // Clear the duplicate input
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
        // If no product found, clear the fields
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
  
    // Create a new row with input fields for product information
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="text" class="form-control product-id" placeholder="Product ID"></td>
      <td><input type="text" class="form-control product-name" placeholder="Product Name" disabled></td>
      <td><input type="number" class="form-control product-price" placeholder="Price" disabled></td>
      <td><input type="number" class="form-control product-quantity" placeholder="Quantity" min="1" value="1"></td>
      <td><button type="button" class="btn btn-danger remove-row">Remove</button></td>
    `;
  
    // Append the new row to the table body
    productRows.appendChild(newRow);
  
    // Attach the product ID listener to the new row
    attachProductIdListener(newRow);
  
    // Add event listener for the remove button
    newRow.querySelector(".remove-row").addEventListener("click", function () {
      newRow.remove();
    });
  });
  
  // Handle row removal for the initial row
  document.querySelector(".remove-row").addEventListener("click", function () {
    this.closest("tr").remove();
  });
  
  // Handle the form submission for order creation
  document.getElementById("add-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Perform any validation or form processing here (e.g., checking if all product rows are filled)
  
    // Show success alert after processing the order
    alert("Order created successfully!");
  });
  