let currentlist;
let purchaseList = [];

document.addEventListener('DOMContentLoaded', () => {
   LoadProducts();
   LoadPurchaseItems();
   
    // Add event listener for the Check NCC ID button
    document.getElementById('checkNccId_btn').addEventListener('click', handleCheckNCCOrder);
    // Add event listener for the form submission
    document.getElementById('add-form').addEventListener('submit', handleStockGoods);
});



// load danh sách sản phẩm
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


// Render sản phẩm
function renderProductList(productList) {
    const productListStock = document.getElementById('product-list-stock');
    productListStock.innerHTML = ''; // Clear the current list

    productList.forEach((product, index) => {

        const thumbnail=product.img.split(" ")[0];
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


// Load thông tin hóa đơn
async function LoadPurchaseItems() {
    try {
        const purchaseData = await apiGetPurchaseItems();
        purchaseList = purchaseData.map(item => {
            return {
                id: item.id,                    // Document ID
                nccOrder: item.pur_ncc,        // NCC Order
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


    

