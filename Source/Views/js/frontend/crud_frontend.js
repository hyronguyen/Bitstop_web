let currentlist;

document.addEventListener('DOMContentLoaded', () => {
   LoadProducts();
});


// load danh sách sản phẩm
async function LoadProducts() {
    try{
        const productData = await apigetAllProducts();
        const productList = productData.map(items => {
            return new Product(
                items.id,
                items.title,
                items.category,
                items.price,
                items.platform,
                items.img,
                items.des,
                items.quan
            );
        });
        currentlist =productList;
        renderProductList(currentlist);
    
    }
    catch (error){
        console.log(error);
    }
}

// Render sản phẩm
function renderProductList(productList) {
    const productTableBody = document.getElementById("product-list");

    productTableBody.innerHTML = "";

    productList.forEach((product, index) => {
        const row = document.createElement("tr");

        const firstImage = product.img.split(" ")[0]; 

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${capitalizeEachWord(product.title)}</td>
            <td>${product.category}</td>
            <td>${formatNumberWithCommas(product.price)} VND</td>
            <td>${product.platform}</td>
            <td>${product.id}</td>
            <td>${product.quantity} items in stock</td>
            <td><img src="${firstImage}" alt="Product Image" width="50" height="50" style="object-fit:cover"></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editProduct(${index + 1})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDelete(${index + 1})">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// form sửa sản phẩm
function editProduct(index) {
    const product = currentlist[index - 1]; 

    const editTab = document.getElementById('edit-tab');
    editTab.style.display = 'block';

    document.getElementById('editProTitle').value = product.title;
    document.getElementById('editProCategory').value = product.category;
    document.getElementById('editProPrice').value = product.price;
    document.getElementById('editProPlatform').value = product.platform;
    document.getElementById('editProDes').value = product.description || ''; // Assuming a description field exists
    document.getElementById('editProQA').value = product.quantity || "N/A"; // Assuming pro_qa (quality assurance) is part of the product
    document.getElementById('editThumbnail').value = product.img.split(" ")[0] || "N/A"; // Set the first image URL
    document.getElementById('editProImg1').value = product.img.split(" ")[1] || "N/A";
    document.getElementById('editProImg2').value = product.img.split(" ")[2] || "N/A";
    // Switch to the Edit tab
    const tab = new bootstrap.Tab(document.querySelector('#edit-tab'));
    tab.show();
}

// form xóa sản phẩm
function confirmDelete(index) {
    const product = currentlist[index - 1];  


    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.getElementById('productIdToDelete').textContent = product.id;
    document.getElementById('confirmProductIdInput').value = "";

    deleteModal.show();

    document.getElementById('confirmDeleteBtn').onclick = function () {

        const inputId = document.getElementById('confirmProductIdInput').value;

        if(inputId === product.id){
            alert(`Đã xóa ${product.id}`);
            // deleteProductById(product.id); 
            // deleteModal.hide();
    
            // currentlist.splice(index - 1, 1);
            // renderProductList(productList);
            deleteModal.hide();
        }
        else{
            alert("Thông tin nhập lại không chính xác");
        }
    };
}


const toggleButton = document.getElementById("toggleSidebar");
const body = document.body;
toggleButton.addEventListener("click", () => {
      body.classList.toggle("collapsed-sidebar");
    });

// format VND
function formatNumberWithCommas(number) {
        return number.toLocaleString();
    }

// Viết hoa 
function capitalizeEachWord(string) {
        return string
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

async function AddNewProduct() {
    const pro_title = document.getElementById("addProTitle").value.toLowerCase(); // Convert title to lowercase
    const pro_category = document.getElementById("addProCategory").value;
    const pro_price = parseFloat(document.getElementById("addProPrice").value);
    const pro_platform = document.getElementById("addProPlatform").value;
  
    // Concatenate image URLs into a single string separated by spaces
    const pro_img = [
        document.getElementById("addThumbnail").value,
        document.getElementById("addProImg1").value,
        document.getElementById("addProImg2").value
    ].join(" "); // Create a single string
  
    const pro_des = document.getElementById("addProDes").value;
    const pro_qa = parseInt(document.getElementById("addProQA").value);
  
  
    // Create product object
    let ProductInfo = {
        pro_title, 
        pro_category,
        pro_price,
        pro_platform, 
        pro_img, 
        pro_des, 
        pro_qa
    };
  

  
    try{
      const result = await apiAddProduct(ProductInfo);
    
    if (result) {
        alert('Product added successfully!');
        document.getElementById("add-form").reset(); // Reset the form
    } else {
        console.log('Failed to add product. Please try again.');
    }
  
    }
    catch(error){
      console.log(error);
    }  
}