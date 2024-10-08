let currentdisplay;

//#region Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    // lấy authToken từ localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        // nếu chưa đăng nhập (không có token)
        window.location.href = 'login.html'; 
    } else {
        console.log('Auth token is present. User is logged in.');
        currentdisplay = JSON.parse(localStorage.getItem('searchResults') || '[]');

        if (currentdisplay.length === 0) {
            LoadProducts();
        } else {
            DisplayProducts(currentdisplay);
            localStorage.removeItem('searchResults');
        }

       
        AddAction();
        
    }
});
//#endregion

function AddAction(){
    FilterbyPlat();
    FilterProductByPrice();
    FilterbyCategory();
    addEventToProductImages();
}

//--------------------------------------------------------------------------------------------------------
//#region REMDER FUNCTIONS
//Load Product
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
                items.description,
                items.quan
            );
        });
        
        currentdisplay=productList;
        DisplayProducts(currentdisplay);
    }
    catch (error){
        console.log(error);
    }
}

//Load product dự trên platform
async function LoadProductsByPlatform(platform) {
    try {
        const response = await apigetProductsByPlat(platform);
        const productList = response.map(product => {
            return new Product(
                product.id,
                product.title,
                product.category,
                product.price,
                product.platform,
                product.img,
                product.description,
                product.quan
            );
        });
        currentdisplay = productList;
        DisplayProducts(currentdisplay);
    } catch (error) {
        console.error('Error loading products by platform:', error);
    }
}

//Load product dựa trên category
async function LoadProductsByCategory(category) {
    try {
        const response = await apigetProductsByCategory(category);
        const productList = response.map(product => {
            return new Product(
                product.id,
                product.title,
                product.category,
                product.price,
                product.platform,
                product.img,
                product.description,
                product.quan
            );
        });
        currentdisplay = productList;
        DisplayProducts(currentdisplay);
    } catch (error) {
        console.error('Error loading products by platform:', error);
    }
}

//Render product ra view
function DisplayProducts(products) {
    const productContainer = document.querySelector('.lattest-product-area .row');
    productContainer.innerHTML = ''; 

    products.forEach(product => {

        const imageUrls = product.img.split(' ');
        const firstImageUrl = imageUrls[0] || '';

        const productHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="single-product" >
                    <img id="image_product" data-id="${product.id}" class="img-fluid product_image" src="${firstImageUrl}" alt="${product.title}" style="height:280px; weight:260px;object-fit:cover; cursor:pointer;">
                    <div class="product-details">
                        <h6>${product.title}</h6>
                        <div class="price">
                            <h6>${formatNumberWithCommas(product.price)} VND</h6>
                            <h6 class="l-through">${formatNumberWithCommas(product.price *1.1 )|| 'N/A'} VND</h6>
                        </div>
                        <div class="prd-bottom">
                            <a  class="social-info">
                                <span class="ti-bag"></span>
                                <p class="hover-text">add to bag</p>
                            </a>
                            <a  class="social-info">
                                <span class="lnr lnr-heart"></span>
                                <p class="hover-text">Wishlist</p>
                            </a>
                            <a  class="social-info">
                                <span class="lnr lnr-sync"></span>
                                <p class="hover-text">compare</p>
                            </a>
                            <a  class="social-info">
                                <span class="lnr lnr-move"></span>
                                <p class="hover-text">view more</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productHTML;
    });

    setupAddToCartButtons();
}

//#endregion

//--------------------------------------------------------------------------------------------------------
//#region  FILTER FUNCTIONS

//Filter dự trên platform
function FilterbyPlat(){
    const platLinks = document.querySelectorAll('.main-nav-list.child a');
    platLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const plat = link.textContent.trim();

            if(plat=="All")
            {
                LoadProducts();
            }
            else
            {
                LoadProductsByPlatform(plat);
            }
        });
    });
}

//Filter dự trên category
function FilterbyCategory(){
    const cateLinks = document.querySelectorAll('.main-nav-list.child.cate-filter a');
    cateLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const cate = link.textContent.trim();
            console.log(cate);

            if(cate=="All")
            {
                LoadProducts();
            }
            else
            {
                LoadProductsByCategory(cate);
            }
        });
    });
}


//Filter dự trên price
function FilterProductByPrice(){
    const applyFilterBtn = document.getElementById('apply-filter-btn');

    // Event listener for "Apply Filter" button
    applyFilterBtn.addEventListener('click', () => {
        const lowerValueString = document.getElementById('lower-value').textContent;
        const upperValueString = document.getElementById('upper-value').textContent;

        const lowerValue = parsePrice(lowerValueString);
        const upperValue = parsePrice(upperValueString);
        console.log(upperValue);
        

        const filteredProducts = currentdisplay.filter(product => 
            product.price >= lowerValue && product.price <= upperValue
        );
    
        const productContainer = document.querySelector('.lattest-product-area .row');

        if (filteredProducts.length === 0) {
            // Render message if no products are found
            productContainer.innerHTML = 
            '<section class="section_gap"> <p class="no-products-message">No products found for the selected price range.</p></section>';
        } else {
            // Display the filtered products
            DisplayProducts(filteredProducts);
        }
    });
}
//#endregion

//--------------------------------------------------------------------------------------------------------
//#region ULTS FUNCTION
function formatNumberWithCommas(number) {
    return number.toLocaleString();
}

function parsePrice(priceString) {
    return parseInt(priceString.replace(/,/g, ''), 10);
}

function addEventToProductImages() {
    const productContainer = document.querySelector('.lattest-product-area .row');

    // Sử dụng event delegation để lắng nghe sự kiện click
    productContainer.addEventListener('click', 
    function(event) {
        if (event.target.id === 'image_product') {
            const productId = event.target.dataset.id;
            sessionStorage.setItem('selectedProductId', productId);
            window.location.href = 'single-product.html'; 
        }
    });
}

function setupAddToCartButtons() {
     const addToCartButtons = document.querySelectorAll('.ti-bag'); 

     // Iterate over each button and add an event listener
     addToCartButtons.forEach(button => {
         // Add click event listener
         button.addEventListener('click', function(event) {
             // Get the closest '.single-product' parent element of the button
             const productElement = event.target.closest('.single-product');
 
             // Get the product ID from the 'data-id' attribute of the image element
             const productId = productElement.querySelector('#image_product').getAttribute('data-id');
            
             
            
             addToCart(productId);
 
         });
     });
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

   alert("Đã thêm vào giỏ hàng");
}
//#endregion